import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Image, Modal, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Jika pakai Android Emulator, gunakan 10.0.2.2. Jika di web, gunakan localhost.
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export default function HomeScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  // States untuk Modals
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resTournaments = await fetch(`${API_URL}/tournaments`);
      const dataTournaments = await resTournaments.json();
      setTournaments(dataTournaments);

      const resTalents = await fetch(`${API_URL}/talents`);
      const dataTalents = await resTalents.json();
      setTalents(dataTalents);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    alert(`Berhasil mengirim permintaan booking ke ${selectedTalent?.name}. Pihak manajemen akan segera menghubungi Anda.`);
    setSelectedTalent(null);
  };

  const handleRegistration = async () => {
    if (!teamName || !contactInfo) {
      alert("Harap isi nama tim dan kontak!");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: selectedTournament._id,
          teamName: teamName,
          contactInfo: contactInfo
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`Pendaftaran tim ${teamName} untuk turnamen ${selectedTournament?.title} berhasil! Data telah disimpan di database.`);
        setTeamName('');
        setContactInfo('');
        setSelectedTournament(null);
      } else {
        alert(`Gagal mendaftar: ${result.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
      console.error(error);
    }
  };

  const renderTournament = ({ item }) => (
    <View style={styles.tournamentCard}>
      <View style={styles.tournamentHeader}>
        <Text style={styles.tournamentTitle}>{item.title}</Text>
        <View style={[styles.badge, item.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.tournamentGame}>🎮 {item.game}</Text>
      <Text style={styles.tournamentPrize}>🏆 {item.prize}</Text>
      <Text style={styles.tournamentOrganizer}>By: {item.organizer}</Text>
      
      <TouchableOpacity 
        style={[styles.joinButton, item.status !== 'Open' && styles.joinButtonDisabled]} 
        disabled={item.status !== 'Open'}
        onPress={() => setSelectedTournament(item)}
      >
        <Text style={styles.joinButtonText}>
          {item.status === 'Open' ? 'Daftar Sekarang' : 'Pendaftaran Ditutup'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#640000" />
          <Text style={styles.loadingText}>Memuat Arena...</Text>
        </View>
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderTournament}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View>
              {/* Fitur 3: Banner/Hero Image */}
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' }} 
                style={styles.heroBanner}
              />

              <Text style={styles.headerTitle}>TARKAMHUB 🚀</Text>
              
              <Text style={styles.sectionTitle}>Talent & Caster Tersedia</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.talentScroll}>
                {talents.map((talent, index) => (
                  <TouchableOpacity 
                    key={talent._id || index} 
                    style={styles.talentCard}
                    activeOpacity={0.8}
                    onPress={() => setSelectedTalent(talent)}
                  >
                    {talent.imageUrl ? (
                      <Image source={{ uri: talent.imageUrl }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{talent.name.charAt(0)}</Text>
                      </View>
                    )}
                    <Text style={styles.talentName}>{talent.name}</Text>
                    <Text style={styles.talentGame}>{talent.gameSpecialty}</Text>
                    <Text style={styles.talentRate}>Rp {talent.ratePerMatch.toLocaleString('id-ID')} / match</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.sectionTitle}>Turnamen Aktif</Text>
            </View>
          }
        />
      )}

      {/* Modal 1: Booking Caster */}
      <Modal
        visible={!!selectedTalent}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTalent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Booking Caster</Text>
            {selectedTalent && (
              <>
                <Text style={styles.modalSub}>Anda akan merekrut:</Text>
                <Text style={styles.modalHighlight}>{selectedTalent.name}</Text>
                <Text style={styles.modalInfo}>Game: {selectedTalent.gameSpecialty}</Text>
                <Text style={styles.modalInfo}>Tarif: Rp {selectedTalent.ratePerMatch.toLocaleString('id-ID')} / match</Text>
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedTalent(null)}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
                <Text style={styles.confirmButtonText}>Konfirmasi Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Formulir Pendaftaran Turnamen */}
      <Modal
        visible={!!selectedTournament}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedTournament(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pendaftaran Turnamen</Text>
            <Text style={styles.modalSub}>{selectedTournament?.title}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Nama Tim" 
              placeholderTextColor="#A0AEC0"
              value={teamName}
              onChangeText={setTeamName}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Nomor WhatsApp/Kontak" 
              placeholderTextColor="#A0AEC0"
              keyboardType="phone-pad"
              value={contactInfo}
              onChangeText={setContactInfo}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setSelectedTournament(null);
                setTeamName('');
                setContactInfo('');
              }}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRegistration}>
                <Text style={styles.confirmButtonText}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#640000',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingTop: 80, 
  },
  heroBanner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#640000',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(100, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#640000',
    marginBottom: 15,
    marginTop: 10,
  },
  talentScroll: {
    marginBottom: 25,
  },
  talentCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#640000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#640000',
  },
  avatarText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  talentName: {
    color: '#1A202C',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  talentGame: {
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
  },
  talentRate: {
    color: '#38A169',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  tournamentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#640000',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tournamentTitle: {
    color: '#1A202C',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  badgeOpen: {
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
  },
  badgeClosed: {
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
  },
  badgeText: {
    color: '#1A202C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tournamentGame: {
    color: '#718096',
    fontSize: 14,
    marginBottom: 4,
  },
  tournamentPrize: {
    color: '#D69E2E',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tournamentOrganizer: {
    color: '#A0AEC0',
    fontSize: 12,
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#640000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  joinButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Styles untuk Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#640000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalHighlight: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfo: {
    fontSize: 14,
    color: '#1A202C',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#1A202C',
    backgroundColor: '#F7FAFC',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4A5568',
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#640000',
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
