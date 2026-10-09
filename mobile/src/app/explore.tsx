import { StyleSheet, Image, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <Text style={styles.name}>Randi Aditiya Suharisman</Text>
          <Text style={styles.nim}>NIM: 2403304</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Tentang Aplikasi</Text>
          <Text style={styles.description}>
            TARKAMHUB adalah platform manajemen turnamen E-Sports yang memungkinkan penyelenggara untuk mengelola pendaftaran tim secara real-time.
            Dilengkapi juga dengan fitur pelacakan talent dan caster profesional (seperti Pak Pulung, KB, Son, dll) untuk memfasilitasi kebutuhan event organizer E-Sports.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Teknologi</Text>
          <View style={styles.techStack}>
            <Text style={styles.techBadge}>React Native</Text>
            <Text style={styles.techBadge}>Expo</Text>
            <Text style={styles.techBadge}>Node.js</Text>
            <Text style={styles.techBadge}>Express</Text>
            <Text style={styles.techBadge}>MongoDB Atlas</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80, // Menghindari konten tertutup oleh navbar web
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#640000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 5,
  },
  nim: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#640000',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
    textAlign: 'left',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignSelf: 'flex-start',
  },
  techBadge: {
    backgroundColor: '#EDF2F7',
    color: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden', // Untuk iOS agar border radius bekerja pada Text
  }
});
