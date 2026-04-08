import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS, ROUTES } from '../../utils/constants';
import authService from '../../services/authService';
import progressService from '../../services/progressService';
import { getUserLevel, formatDate } from '../../utils/helpers';

export default function StudentsListScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const users = await authService.getAllUsers();
      const studentList = users.filter((u) => u.role !== 'admin');
      setStudents(studentList);

      const progressList = await progressService.getAllUsersProgress(
        studentList.map((s) => s.id)
      );
      const map = {};
      progressList.forEach((p) => {
        map[p.userId] = p;
      });
      setProgressMap(map);
    } catch (error) {
      console.error('Load students error:', error);
    }
    setLoading(false);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const renderStudent = ({ item: student }) => {
    const prog = progressMap[student.id] || progressService.getDefaultProgress(student.id);
    const level = getUserLevel(prog.totalPoints);

    return (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() =>
          navigation.navigate(ROUTES.STUDENT_DETAIL, {
            studentId: student.id,
            studentName: student.name,
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.name?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentEmail}>{student.email}</Text>
          <View style={styles.metaRow}>
            <View style={styles.levelChip}>
              <Text style={styles.levelChipText}>Nv. {level.level}</Text>
            </View>
            <Text style={styles.pointsText}>{prog.totalPoints} pts</Text>
            <Text style={styles.separatorDot}>•</Text>
            <Text style={styles.lessonsText}>{prog.completedLessons?.length || 0} lecciones</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          {prog.lastActivityDate && (
            <Text style={styles.lastActive}>
              {prog.lastActivityDate === new Date().toISOString().split('T')[0]
                ? 'Hoy'
                : formatDate(prog.lastActivityDate)}
            </Text>
          )}
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar estudiante..."
            placeholderTextColor={COLORS.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando estudiantes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          renderItem={renderStudent}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>👤</Text>
              <Text style={styles.emptyTitle}>
                {search ? 'No se encontraron resultados' : 'No hay estudiantes registrados'}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.totalText}>
              {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  searchWrapper: { padding: SPACING.md, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border, height: 44 },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginTop: SPACING.sm },
  list: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  totalText: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginBottom: SPACING.sm, fontWeight: '600' },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  studentInfo: { flex: 1 },
  studentName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  studentEmail: { fontSize: FONTS.sizes.sm, color: COLORS.textLight, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: SPACING.xs },
  levelChip: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  levelChipText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '700' },
  pointsText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  separatorDot: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  lessonsText: { fontSize: FONTS.sizes.xs, color: COLORS.textLight },
  rightSection: { alignItems: 'flex-end' },
  lastActive: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginBottom: 4 },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONTS.sizes.md, color: COLORS.textLight, textAlign: 'center' },
});
