import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

function dependency(chain: string[], manifest = new URL('../package.json', import.meta.url)) {
  let request = createRequire(manifest)
  for (const name of chain.slice(0, -1))
    request = createRequire(request.resolve(name))
  return request(chain.at(-1)!)
}

const braces = dependency(['fast-glob', 'micromatch', 'braces'])
const { sprintf } = dependency(['gray-matter', 'js-yaml', 'argparse', 'sprintf-js'])
const forge = dependency(
  ['nuxt/package.json', '@nuxt/nitro-server/package.json', 'nitropack/package.json', 'listhen', 'node-forge'],
  new URL('../packages/vue/package.json', import.meta.url),
)

describe('local dependency security patches', () => {
  it('rejects excessive brace and parenthesis nesting before recursive processing', () => {
    for (const [open, close] of [['{', '}'], ['(', ')']]) {
      const pattern = `${open.repeat(3500)}a,b${close.repeat(3500)}`
      expect(() => braces(pattern)).toThrow(/exceeds max depth/)
      expect(() => braces.expand(pattern)).toThrow(/exceeds max depth/)
    }
    expect(braces.expand('src/{components,styles}/*')).toEqual(['src/components/*', 'src/styles/*'])
    expect(braces.expand('foo/({a,b})')).toEqual(['foo/(a)', 'foo/(b)'])
  })

  it('also bounds callers that supply an AST directly', () => {
    let ast: { type: string, value?: string, nodes?: unknown[] } = { type: 'text', value: 'a' }
    for (let index = 0; index < 150; index++)
      ast = { type: 'brace', nodes: [ast] }
    ast = { type: 'root', nodes: [ast] }
    for (const walk of [braces.compile, braces.expand, braces.stringify])
      expect(() => walk(ast)).toThrow(/exceeds max depth/)
  })

  it('bounds numeric precision without leaking native RangeErrors', () => {
    for (const format of ['f', 'e', 'g']) {
      const output = sprintf(`%.999999999999999999999${format}`, 1.25)
      expect(output.length).toBeLessThan(110)
    }
    expect(sprintf('%.0g', 1.25)).toBe('1')
    expect(sprintf('%.2f', 1.25)).toBe('1.25')
    expect(sprintf('%s: %03d', 'items', 2)).toBe('items: 002')
  })

  it('rejects additional nested DigestAlgorithm elements while accepting ordinary signatures', () => {
    const keys = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 0x10001 })
    const digest = forge.md.sha256.create().update('YunLeFun dependency security')
    expect(keys.publicKey.verify(digest.digest().getBytes(), keys.privateKey.sign(digest))).toBe(true)

    const { asn1 } = forge
    const sequence = (children: unknown[]) => asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, children)
    const identifier = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.oids.sha256).getBytes())
    const parameters = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
    const extra = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, 'extra')
    const hash = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, digest.digest().getBytes())
    for (const algorithm of [[identifier, extra], [identifier, parameters, extra]]) {
      const malformed = asn1.toDer(sequence([sequence(algorithm), hash])).getBytes()
      const signature = keys.privateKey.sign(malformed, 'NONE')
      expect(() => keys.publicKey.verify(digest.digest().getBytes(), signature)).toThrow(/DigestInfo/)
    }
  })
})
