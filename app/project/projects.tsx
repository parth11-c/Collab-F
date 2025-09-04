import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme, themeColors } from '../../context/ThemeContext';
import { useProjects } from '../../context/ProjectContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

export default function ProjectsScreen() {
  const { theme, isDarkMode } = useTheme();
  const colors = themeColors[theme];
  const { projects, loading, error, refreshProjects, deleteProject } = useProjects();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh projects when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshProjects();
    }, [])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProjects();
    setIsRefreshing(false);
  };

  const handleDeleteProject = async (id: string) => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteProject(id);
            if (success) {
              Alert.alert("Success", "Project deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete project");
            }
          }
        }
      ]
    );
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const categories = Array.from(new Set(projects.map(p => p.category)));

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProjects}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]] as [string, string]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>All Projects</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/project/new')}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <BlurView intensity={80} style={[styles.searchContainer, { backgroundColor: colors.searchBackground }]}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={colors.secondaryText} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search projects..."
                placeholderTextColor={colors.secondaryText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </BlurView>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  { backgroundColor: !selectedCategory ? colors.buttonBackground : 'transparent' }
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[styles.categoryText, { color: colors.text }]}>All</Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: selectedCategory === category ? colors.buttonBackground : 'transparent' }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Projects List */}
          {loading && !isRefreshing ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.text} />
            </View>
          ) : (
            <ScrollView 
              style={styles.projectsContainer}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.text}
                />
              }
            >
              {filteredProjects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[styles.projectCard, { backgroundColor: colors.cardBackground }]}
                  onPress={() => router.push(`/project/${project.id}`)}
                >
                  <View style={styles.projectHeader}>
                    <Text style={[styles.projectTitle, { color: colors.text }]}>{project.name}</Text>
                    <Text style={[styles.projectDate, { color: colors.secondaryText }]}>
                      {new Date(project.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.projectDescription, { color: colors.secondaryText }]}>
                    {project.description}
                  </Text>
                  <View style={styles.projectTags}>
                    {project.tags.map((tag, index) => (
                      <View
                        key={index}
                        style={[styles.projectTag, { backgroundColor: colors.tagBackground }]}
                      >
                        <Text style={[styles.categoryText, { color: colors.text }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.projectActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => router.push(`/project/edit/${project.id}`)}
                    >
                      <Ionicons name="create-outline" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteProject(project.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
  },
  addButton: {
    padding: 10,
  },
  searchContainer: {
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  projectsContainer: {
    flex: 1,
  },
  projectCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  projectDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  projectTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ff3b30',
  },
  retryButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
});