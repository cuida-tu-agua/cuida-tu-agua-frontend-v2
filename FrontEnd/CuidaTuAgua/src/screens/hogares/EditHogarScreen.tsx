import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useTheme } from "@theme/index";
import InputField from "@components/auth/InputField";
import PhoneInputField from "@components/auth/PhoneInputField";
import CountrySelectField from "@components/auth/CountrySelectField";
import StratumSelectField from "@components/auth/StratumSelectField";
import PrimaryButton from "@components/auth/PrimaryButton";
import FeedbackModal from "@components/common/FeedbackModal";
import BackArrowButton from "@components/common/BackArrowButton";

import { createStyles } from "./HogarForm.styles";
import { hogarService } from "../../services/hogarService";
import { ApiError } from "../../services/api";
import type { Hogar, HogarFormData } from "../../types/Hogar";
import { emptyHogarFormData } from "../../types/Hogar";

type Props = {
  /** Id del hogar a editar. */
  hogarId: number;
  goBack: () => void;
  onSaved?: (hogar: Hogar) => void;
};

type FeedbackType = "success" | "error" | "info";

const getStratumOptions = (country: string) =>
  country === "Ecuador" ? ["A", "B", "C+", "C-", "D"] : ["1", "2", "3", "4", "5", "6"];

const isValidPhone = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

const isPositiveInteger = (value: string) => /^[1-9][0-9]*$/.test(value);

/** Separa el indicativo (ej. "+57") del resto del número guardado como "+57 3001234567". */
const splitPhone = (fullPhone: string): { countryCode: string; phone: string } => {
  const match = fullPhone.match(/^(\+\d{1,3})\s*(.*)$/);
  if (match) {
    return { countryCode: match[1], phone: match[2] };
  }
  return { countryCode: "+57", phone: fullPhone };
};

export default function EditHogarScreen({ hogarId, goBack, onSaved }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation("hogar");

  const [form, setForm] = useState<HogarFormData>(emptyHogarFormData);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("info");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const hogar = await hogarService.getById(hogarId);
        if (!isMounted) return;

        const { countryCode, phone } = splitPhone(hogar.telefono);
        setForm({
          nombre: hogar.nombre,
          direccion: hogar.direccion,
          telefono: phone,
          countryCode,
          pais: hogar.pais,
          estrato: hogar.estrato,
          habitantes: String(hogar.habitantes),
        });
        setUsuarioId(hogar.usuarioId);
      } catch (error) {
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [hogarId]);

  const updateField = <K extends keyof HogarFormData>(key: K, value: HogarFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const showFeedback = (title: string, message: string, type: FeedbackType = "info") => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  };

  const closeFeedback = () => setFeedbackVisible(false);

  const getInlineError = (
    value: string,
    emptyMessage: string,
    invalidMessage: string,
    validator?: (val: string) => boolean,
  ) => {
    const trimmed = value.trim();
    if (!submitAttempted && !trimmed) return "";
    if (!trimmed) return emptyMessage;
    if (validator && !validator(trimmed)) return invalidMessage;
    return "";
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (!form.nombre.trim()) {
      return showFeedback(t("feedback.errorTitle"), t("feedback.emptyHomeName"), "error");
    }
    if (!form.direccion.trim()) {
      return showFeedback(t("feedback.errorTitle"), t("feedback.emptyAddress"), "error");
    }
    if (!form.telefono.trim() || !isValidPhone(form.telefono.trim())) {
      return showFeedback(t("feedback.errorTitle"), t("feedback.invalidPhone"), "error");
    }
    if (!form.estrato.trim()) {
      return showFeedback(t("feedback.errorTitle"), t("feedback.emptyStratum"), "error");
    }
    if (!form.habitantes.trim() || !isPositiveInteger(form.habitantes.trim())) {
      return showFeedback(t("feedback.errorTitle"), t("feedback.invalidNumber"), "error");
    }

    setSubmitting(true);
    try {
      const hogar = await hogarService.update(hogarId, {
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim(),
        telefono: `${form.countryCode}${form.telefono.trim()}`,
        pais: form.pais.trim(),
        estrato: form.estrato.trim(),
        habitantes: Number(form.habitantes.trim()),
        usuarioId,
      });

      showFeedback(t("success.editTitle"), t("success.editMessage"), "success");
      onSaved?.(hogar);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        showFeedback(t("feedback.errorTitle"), t("feedback.notFound"), "error");
      } else if (error instanceof ApiError && error.status === 409) {
        const isAddressConflict = error.detail?.toLowerCase().includes("dirección");
        showFeedback(
          t("feedback.errorTitle"),
          isAddressConflict ? t("feedback.duplicateAddress") : t("feedback.duplicatePhone"),
          "error",
        );
      } else {
        showFeedback(t("feedback.errorTitle"), t("feedback.saveError"), "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackArrowButton onPress={goBack} style={styles.backButton} />
          <Text style={styles.title}>{t("editTitle")}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.error }}>{t("feedback.loadError")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackArrowButton onPress={goBack} style={styles.backButton} />
        <Text style={styles.title}>{t("editTitle")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.wrapper}>
          <View style={styles.card}>
            <InputField
              label={t("fields.name") ?? ""}
              placeholder={t("fields.name") ?? ""}
              value={form.nombre}
              onChangeText={(value) => updateField("nombre", value)}
              errorMessage={getInlineError(form.nombre, t("feedback.emptyHomeName"), t("feedback.emptyHomeName"))}
            />

            <InputField
              label={t("fields.address") ?? ""}
              placeholder={t("fields.address") ?? ""}
              value={form.direccion}
              onChangeText={(value) => updateField("direccion", value)}
              errorMessage={getInlineError(form.direccion, t("feedback.emptyAddress"), t("feedback.emptyAddress"))}
            />

            <PhoneInputField
              label={t("fields.phone") ?? ""}
              placeholder={t("fields.phone") ?? ""}
              countryCode={form.countryCode}
              onCountryCodeChange={(code) => updateField("countryCode", code)}
              value={form.telefono}
              onChangeText={(value) => updateField("telefono", value)}
              errorMessage={
                form.telefono.length > 0 && !isValidPhone(form.telefono) ? t("feedback.invalidPhone") : ""
              }
            />

            <CountrySelectField
              label={t("fields.country") ?? ""}
              value={form.pais}
              onCountryChange={(country, code) => {
                updateField("pais", country);
                updateField("countryCode", code);
              }}
            />

            <StratumSelectField
              label={t("fields.stratum") ?? ""}
              value={form.estrato}
              onChange={(value) => updateField("estrato", value)}
              options={getStratumOptions(form.pais)}
              errorMessage={getInlineError(form.estrato, t("feedback.emptyStratum"), t("feedback.emptyStratum"))}
            />

            <InputField
              label={t("fields.inhabitants") ?? ""}
              placeholder={t("fields.inhabitants") ?? ""}
              value={form.habitantes}
              onChangeText={(value) => updateField("habitantes", value.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              errorMessage={getInlineError(
                form.habitantes,
                t("feedback.emptyInhabitants"),
                t("feedback.invalidNumber"),
                isPositiveInteger,
              )}
            />

            <PrimaryButton
              title={t("action.save") ?? ""}
              onPress={handleSubmit}
              loading={submitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>

      <FeedbackModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        onClose={closeFeedback}
      />
    </SafeAreaView>
  );
}
