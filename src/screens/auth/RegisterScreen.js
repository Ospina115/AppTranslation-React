import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { COLORS, SPACING, FONTS, RADIUS } from '../../utils/constants';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    else if (form.name.trim().length < 2) errs.name = 'Nombre muy corto';

    if (!form.email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo no válido';

    if (!form.password) errs.password = 'La contraseña es requerida';
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';

    if (!form.confirm) errs.confirm = 'Confirma tu contraseña';
    else if (form.confirm !== form.password) errs.confirm = 'Las contraseñas no coinciden';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Error', result.error || 'No se pudo crear la cuenta.');
    }
  };

  const Field = ({ field, label, icon, placeholder, secureTextEntry, keyboardType, autoCapitalize }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <Ionicons name={icon} size={20} color={COLORS.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={form[field]}
          onChangeText={(v) => update(field, v)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
          autoCorrect={false}
        />
        {field === 'password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.emoji}>🎓</Text>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Comienza a mejorar tu inglés hoy</Text>
          </View>

          <View style={styles.form}>
            <Field
              field="name"
              label="Nombre completo"
              icon="person-outline"
              placeholder="Ej. María García"
            />
            <Field
              field="email"
              label="Correo electrónico"
              icon="mail-outline"
              placeholder="usuario@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field
              field="password"
              label="Contraseña"
              icon="lock-closed-outline"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />
            <Field
              field="confirm"
              label="Confirmar contraseña"
              icon="shield-checkmark-outline"
              placeholder="Repite tu contraseña"
              secureTextEntry
            />

            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={styles.registerBtn}
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  header: { alignItems: 'center', paddingVertical: SPACING.xl },
  emoji: { fontSize: 48 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary, marginTop: SPACING.sm },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginTop: SPACING.xs },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    minHeight: 50,
  },
  inputError: { borderColor: COLORS.error },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, paddingVertical: SPACING.sm },
  errorText: { fontSize: FONTS.sizes.xs, color: COLORS.error, marginTop: 4 },
  registerBtn: { marginTop: SPACING.sm },
  loginLink: { alignItems: 'center', marginTop: SPACING.lg },
  loginLinkText: { fontSize: FONTS.sizes.md, color: COLORS.textLight },
  loginLinkBold: { color: COLORS.primary, fontWeight: '700' },
});
