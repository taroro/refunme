import {Platform} from 'react-native'

export default {
    ...Platform.select({
        ios: {
            FONT_FAMILY: "Sukhumvit Set",
        },
        android: {
            FONT_FAMILY: "sukhumvitset_text",
        },
      }),
    FONT_SIZE_SMALL: 14,
    FONT_SIZE_MEDIUM: 16,
    FONT_SIZE_LARGE: 18,
    FONT_SIZE_HEADER: 22,
    FONT_SIZE_EXTRA: 28,
    FONT_SIZE_LARGEST: 44,
    FONT_PRIMARY_COLOR: "#4A4A4A",
    FONT_SECONDARY_COLOR: "#828282",
    FONT_WEIGHT_LIGHT: 200,
    FONT_WEIGHT_MEDIUM: 600,
    FONT_WEIGHT_HEAVY: 800,

    PRIMARY_COLOR: "#9BC73C",
    SECONDARY_COLOR: "#BDBDBD",
    DISABLE_COLOR: "#F1F3F4", 
    BACKGROUND_PRIMARY_COLOR: "#E3E2DD",
    BACKGROUND_SECONDARY_COLOR: "#FFFFFF",

    COLOR_DARKGREY: "#1D1C23",
    COLOR_DARKGREY2: "#828282",
    COLOR_LIGHTGREY: "#F7F7F7",
    COLOR_FACEBOOK: "#2E77BB",
    COLOR_WHITE: "#FFFFFF",
    COLOR_RED: "#F75E71",
};