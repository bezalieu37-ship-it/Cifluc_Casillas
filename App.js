import React from 'react';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function ErrorFallback({ error, onReset }) {
  const { t } = useLanguage();

  return (
    <View style={errorStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={errorStyles.logo}>CIFLUC</Text>
      <Text style={errorStyles.title}>{t('common.unexpectedErrorTitle')}</Text>
      <Text style={errorStyles.subtitle}>{t('common.unexpectedErrorText')}</Text>
      <Text style={errorStyles.errorText}>
        {error?.message || t('common.unknownError')}
      </Text>
      <TouchableOpacity style={errorStyles.button} onPress={onReset}>
        <Text style={errorStyles.buttonText}>{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  logo: {
    color: '#FFD400',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 16
  },
  title: {
    color: '#FF4444',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12
  },
  errorText: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 16
  },
  button: {
    backgroundColor: '#FFD400',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13
  }
});

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
