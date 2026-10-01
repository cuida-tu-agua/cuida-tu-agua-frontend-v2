import { StyleSheet } from "react-native";
import { ThemeColors, spacing, typography } from "@theme/index";

/**
 * Estilos compartidos por CreateHogarScreen y EditHogarScreen.
 * Layout simplificado de una sola columna (a diferencia de RegisterScreen,
 * que tiene un layout especial de dos columnas + carrusel solo para la
 * pantalla de login/registro en web).
 */
export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.md,
    },

    backButton: {
      marginRight: spacing.xs,
    },

    title: {
      ...typography.title,
      color: colors.textPrimary,
      fontSize: 22,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.xxl,
    },

    wrapper: {
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
      paddingHorizontal: spacing.lg,
    },

    card: {
      width: "100%",
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: spacing.lg,
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.06)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 4,
    },

    submitButton: {
      marginTop: spacing.md,
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
