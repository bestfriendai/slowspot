/**
 * ProfileHeader - User avatar and editable name header
 * Extracted from ProfileScreen for better code organization
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

interface ProfileHeaderProps {
  userName: string | undefined;
  isEditing: boolean;
  editedName: string;
  primaryColor: string;
  colors: {
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    background: {
      secondary: string;
      tertiary: string;
    };
  };
  isDark: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  isEditing,
  editedName,
  primaryColor,
  colors,
  isDark,
  onStartEdit,
  onSave,
  onCancel,
  onNameChange,
}) => {
  const { t } = useTranslation();
  const nameInputRef = useRef<TextInput>(null);

  const handleStartEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onStartEdit();
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
    onSave();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onCancel();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={handleStartEdit}
        activeOpacity={0.8}
        style={styles.avatarContainer}
        accessibilityLabel={t('accessibility.editProfile', 'Edit profile')}
        accessibilityRole="button"
      >
        <Ionicons
          name="person-circle"
          size={64}
          color={primaryColor}
          style={styles.avatar}
        />
        <View style={[styles.editBadge, { backgroundColor: primaryColor }]}>
          <Ionicons name="pencil" size={12} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {isEditing ? (
        <View style={styles.nameEditContainer}>
          <TextInput
            ref={nameInputRef}
            style={[
              styles.nameInput,
              {
                color: colors.text.primary,
                backgroundColor: isDark ? colors.background.secondary : '#F5F5F7',
                borderColor: primaryColor,
              },
            ]}
            value={editedName}
            onChangeText={onNameChange}
            placeholder={t('profile.enterYourName')}
            placeholderTextColor={colors.text.tertiary}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            autoCapitalize="words"
            accessibilityLabel={t('profile.enterYourName', 'Enter your name')}
          />
          <View style={styles.nameEditButtons}>
            <TouchableOpacity
              style={[
                styles.nameEditButton,
                styles.cancelButton,
                { backgroundColor: isDark ? colors.background.tertiary : '#E5E5E7' },
              ]}
              onPress={handleCancel}
              accessibilityLabel={t('common.cancel', 'Cancel')}
              accessibilityRole="button"
            >
              <Ionicons name="close" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.nameEditButton,
                styles.saveButton,
                { backgroundColor: primaryColor },
              ]}
              onPress={handleSave}
              accessibilityLabel={t('common.save', 'Save')}
              accessibilityRole="button"
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={handleStartEdit} style={styles.nameDisplayContainer}>
          {userName ? (
            <Text style={[styles.userName, { color: colors.text.primary }]}>{userName}</Text>
          ) : (
            <Text style={[styles.addNameHint, { color: colors.text.tertiary }]}>
              {t('profile.tapToAddName')}
            </Text>
          )}
          <Text style={[styles.title, { color: colors.text.primary }]}>{t('profile.title')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    marginBottom: theme.spacing.sm,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  nameDisplayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  addNameHint: {
    fontSize: theme.typography.fontSizes.md,
    fontStyle: 'italic',
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
  },
  nameEditContainer: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  nameInput: {
    width: '80%',
    height: 48,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  nameEditButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButton: {},
  saveButton: {},
});
