import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const css = compile(resolve(import.meta.dirname, '../packages/ui/styles/css-vars.scss')).css

function declarations(selector: string) {
  const block = css.split(`${selector} {`)[1]?.split('}')[0]
  if (!block)
    throw new Error(`Missing theme: ${selector}`)
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):([^;]+);/g)].map(match => [match[1], match[2].trim()]))
}

const light = declarations('.ylf-theme-light')
const dark = { ...light, ...declarations('.ylf-theme-dark') }

function color(tokens: Record<string, string>, name: string): string {
  const value = tokens[name]
  if (!value)
    throw new Error(`Missing token: ${name}`)
  const reference = value.match(/^var\((--[\w-]+)\)$/)
  return reference ? color(tokens, reference[1]) : value
}

function luminance(hex: string) {
  if (!/^#[\da-f]{6}$/i.test(hex))
    throw new Error(`Expected a six-digit color, received ${hex}`)
  const channels = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

describe.each([{ name: 'light', tokens: light }, { name: 'dark', tokens: dark }])('$name color tokens', ({ tokens }) => {
  it.each(['blue', 'sun', 'cyan', 'coral', 'pink', 'green'])('%s supports small text on solid, hover and soft fills', (tone) => {
    const prefix = `--ylf-accent-${tone}`
    for (const [foreground, background] of [
      [`${prefix}-on`, prefix],
      [`${prefix}-on`, `${prefix}-hover`],
      [`${prefix}-text`, `${prefix}-soft`],
      [`${prefix}-text`, '--ylf-c-surface'],
      [`${prefix}-text`, '--ylf-c-bg'],
      ['--ylf-c-text', `${prefix}-soft`],
      ['--ylf-c-text-2', `${prefix}-soft`],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps featured and primary labels readable', () => {
    for (const [foreground, background] of [
      ['--ylf-c-feature-text', '--ylf-c-feature-bg'],
      ['--ylf-c-text-on-accent', '--ylf-c-brand'],
      ['--ylf-c-text-on-accent', '--ylf-c-brand-hover'],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it.each([
    ['success', 'green'],
    ['warning', 'sun'],
    ['danger', 'coral'],
    ['info', 'cyan'],
  ])('%s shares the %s palette and readable foregrounds', (status, tone) => {
    const prefix = `--ylf-status-${status}`
    for (const suffix of ['', '-hover', '-on', '-soft', '-text'])
      expect(color(tokens, `${prefix}${suffix}`)).toBe(color(tokens, `--ylf-accent-${tone}${suffix}`))
    for (const [foreground, background] of [
      [`${prefix}-on`, prefix],
      [`${prefix}-on`, `${prefix}-hover`],
      [`${prefix}-text`, `${prefix}-soft`],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })
})
