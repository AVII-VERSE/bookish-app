
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme';
import { Button } from '../components/Button';
import { analyzeDocument, AnalysisResponse, AnalysisRequest } from '../services/api';

interface MedicalAnalysisScreenProps {
  onNavigate: (screen: string) => void;
  isDark: boolean;
}

export const MedicalAnalysisScreen: React.FC<MedicalAnalysisScreenProps> = ({ isDark }) => {
  const [inputType, setInputType] = useState<'text' | 'pdf' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setAnalysisResult(null);

    if (inputType === 'text' && !textInput.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    if ((inputType === 'pdf' || inputType === 'image') && !selectedFile) {
      setError(`Please select a ${inputType.toUpperCase()} file`);
      return;
    }

    setIsAnalyzing(true);

    try {
      const request: AnalysisRequest = {
        inputType,
        text: inputType === 'text' ? textInput : undefined,
        file: selectedFile || undefined,
      };

      const result = await analyzeDocument(request);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setTextInput('');
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>MEDIC-ROXX Analysis</Text>
        <Text style={styles.subtitle}>Medical Document Intelligence & Analysis</Text>
      </View>

      <View style={styles.inputTypeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, inputType === 'text' && styles.typeButtonActive]}
          onPress={() => {
            setInputType('text');
            setSelectedFile(null);
            setError(null);
          }}
        >
          <Icon name="text-fields" size={20} color={inputType === 'text' ? COLORS.primary : COLORS.slate400} />
          <Text style={[styles.typeButtonText, inputType === 'text' && styles.typeButtonTextActive]}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, inputType === 'pdf' && styles.typeButtonActive]}
          onPress={() => {
            setInputType('pdf');
            setTextInput('');
            setError(null);
          }}
        >
          <Icon name="picture-as-pdf" size={20} color={inputType === 'pdf' ? COLORS.primary : COLORS.slate400} />
          <Text style={[styles.typeButtonText, inputType === 'pdf' && styles.typeButtonTextActive]}>PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, inputType === 'image' && styles.typeButtonActive]}
          onPress={() => {
            setInputType('image');
            setTextInput('');
            setError(null);
          }}
        >
          <Icon name="image" size={20} color={inputType === 'image' ? COLORS.primary : COLORS.slate400} />
          <Text style={[styles.typeButtonText, inputType === 'image' && styles.typeButtonTextActive]}>Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        {inputType === 'text' ? (
          <View style={styles.textInputContainer}>
            <Text style={styles.label}>Medical Report / Prescription Text</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={8}
              placeholder="Enter or paste medical report text, prescription details, or symptoms..."
              placeholderTextColor={COLORS.slate400}
              value={textInput}
              onChangeText={setTextInput}
            />
          </View>
        ) : (
          <View style={styles.fileInputContainer}>
            <Text style={styles.label}>Upload {inputType === 'pdf' ? 'PDF' : 'Image'} File</Text>
            <input
              ref={fileInputRef}
              type="file"
              accept={inputType === 'pdf' ? '.pdf' : 'image/*'}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => fileInputRef.current?.click()}
            >
              <Icon name="cloud-upload" size={32} color={COLORS.primary} />
              <Text style={styles.fileButtonText}>
                {selectedFile ? selectedFile.name : `Select ${inputType === 'pdf' ? 'PDF' : 'Image'} File`}
              </Text>
              {selectedFile && (
                <Text style={styles.fileSize}>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="error" size={20} color={COLORS.red500} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          onPress={handleSubmit}
          isLoading={isAnalyzing}
          disabled={isAnalyzing}
          fullWidth
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
        </Button>
        {(textInput || selectedFile || analysisResult) && (
          <Button
            variant="outline"
            onPress={handleClear}
            fullWidth
            style={styles.clearButton}
          >
            Clear
          </Button>
        )}
      </View>

      {isAnalyzing && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.progressText}>Processing medical document...</Text>
          <Text style={styles.progressSubtext}>Extracting medications, recommendations, and insights</Text>
        </View>
      )}

      {analysisResult && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Icon name="check-circle" size={24} color={COLORS.green500} />
            <Text style={styles.resultsTitle}>Analysis Complete</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="description" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{analysisResult.summary}</Text>
            {analysisResult.confidence && (
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            )}
          </View>

          {analysisResult.medications && analysisResult.medications.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="medical-services" size={20} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Medications</Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.tableColName]}>Medication</Text>
                  <Text style={[styles.tableHeaderText, styles.tableColDosage]}>Dosage</Text>
                  <Text style={[styles.tableHeaderText, styles.tableColTiming]}>Timing</Text>
                </View>
                {analysisResult.medications.map((med, index) => (
                  <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                    <View style={styles.tableColName}>
                      <Text style={styles.medicationName}>{med.name}</Text>
                      {med.frequency && <Text style={styles.medicationFrequency}>{med.frequency}</Text>}
                    </View>
                    <Text style={[styles.tableText, styles.tableColDosage]}>{med.dosage}</Text>
                    <Text style={[styles.tableText, styles.tableColTiming]}>{med.timing}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {analysisResult.hospitals && analysisResult.hospitals.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="local-hospital" size={20} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Recommended Medical Facilities</Text>
              </View>
              {analysisResult.hospitals.map((hospital, index) => (
                <View key={index} style={styles.hospitalCard}>
                  <View style={styles.hospitalHeader}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    {hospital.distance && (
                      <View style={styles.distanceBadge}>
                        <Icon name="location-on" size={12} color={COLORS.primary} />
                        <Text style={styles.distanceText}>{hospital.distance}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.hospitalAddress}>{hospital.address}</Text>
                  <View style={styles.specializationBadge}>
                    <Text style={styles.specializationText}>{hospital.specialization}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {analysisResult.keyInsights && analysisResult.keyInsights.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="lightbulb" size={20} color={COLORS.amber500} />
                <Text style={styles.cardTitle}>Key Insights</Text>
              </View>
              {analysisResult.keyInsights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Icon name="arrow-right" size={20} color={COLORS.green500} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.slate400,
  },
  inputTypeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 2,
    borderColor: COLORS.surfaceDark,
  },
  typeButtonActive: {
    backgroundColor: `${COLORS.primary}15`,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate400,
  },
  typeButtonTextActive: {
    color: COLORS.primary,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate200,
    marginBottom: 12,
  },
  textInputContainer: {
    width: '100%',
  },
  textArea: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: COLORS.textDark,
    minHeight: 160,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.slate800,
  },
  fileInputContainer: {
    width: '100%',
  },
  fileButton: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: COLORS.slate400,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.red500}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red500,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.red500,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  clearButton: {
    marginTop: 0,
  },
  progressContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 12,
    gap: 12,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  progressSubtext: {
    fontSize: 14,
    color: COLORS.slate400,
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.slate200,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.green500}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.green500,
  },
  table: {
    gap: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate800,
  },
  tableRowEven: {
    backgroundColor: `${COLORS.slate800}50`,
  },
  tableColName: {
    flex: 2,
  },
  tableColDosage: {
    flex: 1,
  },
  tableColTiming: {
    flex: 1,
  },
  tableText: {
    fontSize: 14,
    color: COLORS.slate200,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  medicationFrequency: {
    fontSize: 12,
    color: COLORS.slate400,
  },
  hospitalCard: {
    backgroundColor: COLORS.backgroundDark,
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  hospitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  hospitalAddress: {
    fontSize: 13,
    color: COLORS.slate400,
  },
  specializationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.amber500}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  specializationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.amber500,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.slate200,
  },
});
