import {
  buildAllTokenNames,
  buildBaseDarkTokens,
  buildBaseLightTokens,
  buildCompatDarkTokens,
  buildCompatLightTokens,
  ylfAccents,
  ylfAccentTones,
  ylfAtmosphere,
  ylfBrand,
  ylfCloud,
  ylfCloudShapes,
  ylfCloudSilhouettes,
  ylfComponentTokenNames,
  ylfFocusAndControls,
  ylfGlass,
  ylfHero,
  ylfInteractionAndMotion,
  ylfLayout,
  ylfNeutrals,
  ylfPalette,
  ylfProfiles,
  ylfProfileTokens,
  ylfRadius,
  ylfShadow,
  ylfSpace,
  ylfStatuses,
  ylfStatusMap,
  ylfTypography,
  ylfZIndex,
} from './source.mjs'

const tokenNames = buildAllTokenNames()

export const ylfTokenNames = tokenNames.core
export const ylfCompatTokenNames = tokenNames.compat

export const ylfTokens = {
  palette: ylfPalette,
  brand: ylfBrand,
  hero: ylfHero,
  accents: ylfAccents,
  statusMap: ylfStatusMap,
  neutrals: ylfNeutrals,
  glass: ylfGlass,
  radius: ylfRadius,
  shadow: ylfShadow,
  typography: ylfTypography,
  space: ylfSpace,
  layout: ylfLayout,
  zIndex: ylfZIndex,
  focusAndControls: ylfFocusAndControls,
  interactionAndMotion: ylfInteractionAndMotion,
  atmosphere: ylfAtmosphere,
  cloud: ylfCloud,
  profiles: ylfProfileTokens,
  light: buildBaseLightTokens(),
  dark: buildBaseDarkTokens(),
  compat: {
    light: buildCompatLightTokens(),
    dark: buildCompatDarkTokens(),
  },
}

export {
  ylfAccentTones,
  ylfCloudShapes,
  ylfCloudSilhouettes,
  ylfComponentTokenNames,
  ylfPalette,
  ylfProfiles,
  ylfStatuses,
}
