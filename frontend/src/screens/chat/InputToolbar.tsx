import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface InputToolbarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  value,
  onChangeText,
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSendMessage();
      Keyboard.dismiss();
    }
  };

  const handleAttachment = () => {
    // Will implement later
    console.log('Attachment pressed');
  };

  const handleEmoji = () => {
    // Will implement later
    console.log('Emoji pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {/* Attachment Button */}
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleAttachment}
        disabled={disabled}
      >
        <Ionicons name="add" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Text Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.subtitle}
          multiline
          maxLength={1000}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSend}
        />
        
        {/* Emoji Button */}
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={handleEmoji}
          disabled={disabled}
        >
          <Ionicons name="happy" size={20} color={colors.subtitle} />
        </TouchableOpacity>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          { backgroundColor: value.trim() ? colors.primary : colors.subtitle },
          disabled && styles.buttonDisabled,
        ]}
        onPress={handleSend}
        disabled={!value.trim() || disabled}
      >
        <Ionicons
          name={value.trim() ? "send" : "mic"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    minHeight: 60,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 80,
  },
  button: {
    padding: 8,
    borderRadius: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});