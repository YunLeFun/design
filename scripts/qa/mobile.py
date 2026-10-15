"""Actual shared-component interactions; requires Python Playwright and Chrome."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3102'
OUT = Path(__file__).resolve().parents[2] / 'artifacts/mobile'
OUT.mkdir(parents=True, exist_ok=True)
report = {'timestamp': datetime.now(timezone.utc).isoformat(), 'cases': [], 'errors': []}

def style(locator, prop):
    return locator.evaluate('(e, p) => getComputedStyle(e)[p]', prop)

def bounded(page, locator):
    b = locator.bounding_box()
    assert b and b['x'] >= -1 and b['y'] >= -1, b
    assert b['x'] + b['width'] <= page.viewport_size['width'] + 1, b
    assert b['y'] + b['height'] <= page.viewport_size['height'] + 1, b
    return b

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    report['browser'] = browser.version
    for width, dark, reduced, height in [(390, False, False, 844), (320, False, False, 740), (390, True, False, 844), (320, True, True, 568), (390, False, True, 844)]:
        name = f'{width}-{"dark" if dark else "light"}-{"reduced" if reduced else "motion"}'
        ctx = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True, device_scale_factor=1, reduced_motion='reduce' if reduced else 'no-preference')
        page = ctx.new_page()
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        page.goto(BASE)
        page.wait_for_load_state('networkidle')
        expect(page.get_by_role('heading', name='轻触，即有回应')).to_be_visible()
        if dark:
            page.get_by_role('button', name='深色', exact=True).tap()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.evaluate('matchMedia("(pointer: coarse)").matches')
        for selector in ['.ylf-button', '.ylf-segmented__item', '.ylf-select__trigger', '.ylf-accordion__trigger']:
            for control in page.locator(selector).all():
                b = control.bounding_box()
                assert b['height'] >= 44 and b['width'] >= 44, (selector, b)
        # Expanded target space is actually clickable, beyond the visible switch / checkbox.
        for role, label in [('switch', '使用常备调料'), ('checkbox', '记住我的选择')]:
            control = page.get_by_role(role, name=label)
            before = control.get_attribute('aria-checked')
            control.scroll_into_view_if_needed()
            b = control.bounding_box()
            page.touchscreen.tap(b['x'] + b['width'] / 2, b['y'] - 5)
            expect(control).to_have_attribute('aria-checked', 'false' if before == 'true' else 'true')
        page.get_by_role('button', name='还差一种', exact=True).tap()
        expect(page.get_by_role('button', name='还差一种', exact=True)).to_have_attribute('aria-pressed', 'true')
        # Pointer feedback never stays at the desktop hover lift after a touch.
        primary = page.get_by_role('button', name='查看推荐', exact=True)
        primary.tap()
        primary = page.get_by_role('button', name='查看推荐 1', exact=True)
        page.wait_for_function("getComputedStyle(document.querySelector('.ylf-button--primary:not([disabled])')).transform === 'none'")
        assert style(primary, 'transform') == 'none'
        b = primary.bounding_box()
        page.mouse.move(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
        page.mouse.down()
        page.wait_for_timeout(120)
        transform = style(primary, 'transform')
        assert (transform == 'none') if reduced else ('0.98' in transform), transform
        page.mouse.up()
        # A small select still has comfortable menu targets and preserves disabled options.
        select = page.get_by_role('combobox', name='推荐排序')
        select.tap()
        option = page.get_by_role('option', name='制作时间优先')
        expect(option).to_be_visible()
        page.wait_for_timeout(260)
        assert option.bounding_box()['height'] >= 44
        expect(page.get_by_role('option', name='暂不可用')).to_have_attribute('aria-disabled', 'true')
        bounded(page, page.locator('.ylf-select__content'))
        option.tap()
        expect(select).to_contain_text('制作时间优先')
        accordion = page.get_by_role('button', name='为什么推荐这道菜？')
        accordion.tap()
        expect(accordion).to_have_attribute('aria-expanded', 'true')
        page.wait_for_timeout(300)
        expect(page.get_by_text('已选番茄和鸡蛋', exact=False)).to_be_visible()
        trigger = page.get_by_role('button', name='偏好设置', exact=True)
        trigger.tap()
        dialog = page.get_by_role('dialog', name='调整推荐偏好')
        expect(dialog).to_be_visible()
        page.wait_for_function("document.querySelector('.ylf-dialog__content').getAnimations().length === 0")
        bounded(page, dialog)
        close = page.get_by_role('button', name='关闭', exact=True)
        assert close.bounding_box()['height'] >= 43.99, (name, close.bounding_box(), close.evaluate("e => ({css: getComputedStyle(e).height, target: getComputedStyle(e).getPropertyValue('--ylf-touch-target'), parent: getComputedStyle(e.parentElement).transform, animations:e.parentElement.getAnimations().map(a=>a.playState)})"))
        surface = dialog.evaluate("e => getComputedStyle(e).getPropertyValue('--ylf-c-text').trim()")
        expected = page.locator('.mobile-demo').evaluate("e => getComputedStyle(e).getPropertyValue('--ylf-c-text').trim()")
        assert surface == expected, (surface, expected)
        for radio in dialog.get_by_role('radio').all():
            assert radio.bounding_box()['height'] >= 44
        dialog.get_by_role('radio', name='显示匹配详情').tap()
        expect(dialog.get_by_role('radio', name='显示匹配详情')).to_have_attribute('aria-checked', 'true')
        can_scroll = dialog.evaluate('e => e.scrollHeight > e.clientHeight')
        if height <= 568:
            assert can_scroll
            dialog.hover()
            page.mouse.wheel(0, 400)
            page.wait_for_timeout(100)
            assert dialog.evaluate('e => e.scrollTop') > 0
            dialog.evaluate('e => e.scrollTop = 0')
            # Exercise asymmetric safe-area geometry without claiming real-device coverage.
            dialog.evaluate("e => { e.style.setProperty('--_inset-top', '64px'); e.style.setProperty('--_inset-left', '72px'); }")
            safe_box = bounded(page, dialog)
            assert safe_box['x'] >= 71.99 and safe_box['y'] >= 63.99, safe_box
            dialog.evaluate("e => { e.style.removeProperty('--_inset-top'); e.style.removeProperty('--_inset-left'); }")
        page.screenshot(path=str(OUT / f'{name}-dialog.png'))
        page.get_by_role('button', name='关闭', exact=True).tap()
        expect(dialog).to_have_count(0)
        expect(trigger).to_be_focused()
        page.get_by_role('button', name='查看说明', exact=True).tap()
        popup = page.locator('.ylf-popover')
        expect(popup).to_be_visible()
        page.wait_for_timeout(260)
        bounded(page, popup)
        page.keyboard.press('Escape')
        expect(popup).to_have_count(0)
        page.get_by_role('button', name='更多操作', exact=True).tap()
        menu = page.get_by_role('menu')
        expect(menu).to_be_visible()
        page.wait_for_timeout(260)
        bounded(page, menu)
        for item in menu.get_by_role('menuitem').all():
            assert item.bounding_box()['height'] >= 44
        menu.get_by_role('menuitem', name='收藏推荐').tap()
        expect(page.locator('output')).to_contain_text('收藏推荐')
        if reduced:
            assert style(page.locator('.ylf-button__spinner'), 'animationName') == 'none'
            assert style(page.locator('.ylf-switch__thumb'), 'transitionDuration') == '0s'
            assert style(page.locator('.ylf-accordion__content'), 'animationName') == 'none'
        # Long labels stay in the viewport, including unbroken text.
        primary = page.locator('.ylf-button--primary:not([disabled])').first
        primary.locator('.ylf-button__label').evaluate("e => e.textContent = 'LongLabelWithoutSpaces'.repeat(5)")
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        primary.locator('.ylf-button__label').evaluate("e => e.textContent = '查看推荐 2'")
        page.evaluate('scrollTo(0, 0)')
        # Avoid full-page capture: Chrome 154 resets pointer media when capture
        # extends the viewport. Real-size screenshots keep the touch layout intact.
        page.screenshot(path=str(OUT / f'{name}.png'))
        assert page.evaluate('matchMedia("(pointer: coarse)").matches')
        page.evaluate('scrollTo(0, document.documentElement.scrollHeight)')
        page.screenshot(path=str(OUT / f'{name}-controls.png'))
        assert page.evaluate('matchMedia("(pointer: coarse)").matches')
        report['cases'].append({'name': name, 'passed': True, 'dialog_scrollable': can_scroll, 'pressed_transform': transform, 'theme_text': surface})
        ctx.close()
    # Desktop still has pointer hover and keyboard focus; motion settings change live.
    ctx = browser.new_context(viewport={'width': 1024, 'height': 900})
    page = ctx.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.goto(BASE)
    page.wait_for_load_state('networkidle')
    primary = page.get_by_role('button', name='查看推荐', exact=True)
    primary.hover()
    page.wait_for_timeout(200)
    assert style(primary, 'transform') == 'matrix(1, 0, 0, 1, 0, -1)'
    primary.focus()
    assert primary.evaluate('e => e.matches(":focus-visible")')
    page.emulate_media(reduced_motion='reduce')
    assert style(primary, 'transform') == 'none'
    page.get_by_role('button', name='偏好设置', exact=True).click()
    expect(page.get_by_role('dialog')).to_be_visible()
    assert style(page.get_by_role('dialog'), 'animationName') == 'none'
    page.keyboard.press('Escape')
    expect(page.get_by_role('button', name='偏好设置', exact=True)).to_be_focused()
    report['cases'].append({'name': 'desktop-keyboard-live-reduced-motion', 'passed': True})
    ctx.close()
    browser.close()
assert not report['errors'], report['errors']
(OUT / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
