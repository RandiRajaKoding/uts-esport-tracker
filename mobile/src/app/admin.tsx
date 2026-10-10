import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export default function AdminScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [prize, setPrize] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tournaments`);
      const data = await res.json();
      setTournaments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !game || !prize || !organizer) {
      alert('Mohon isi semua bidang!');
      return;
    }

    try {
      const url = editingId ? `${API_URL}/tournaments/${editingId}` : `${API_URL}/tournaments`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, game, prize, organizer, status: 'Open' })
      });

      if (res.ok) {
        alert(editingId ? 'Turnamen berhasil diupdate!' : 'Turnamen baru berhasil ditambahkan!');
        resetForm();
        fetchTournaments();
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan turnamen.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tournaments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTournaments();
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus turnamen.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setGame(item.game);
    setPrize(item.prize);
    setOrganizer(item.organizer);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setGame('');
    setPrize('');
    setOrganizer('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.game} - {item.prize}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
          <Text style={styles.btnText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Manajemen Turnamen (CRUD)</Text>
      
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Nama Turnamen" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Game (e.g. Mobile Legends)" value={game} onChangeText={setGame} />
        <TextInput style={styles.input} placeholder="Hadiah (e.g. Rp 5.000.000)" value={prize} onChangeText={setPrize} />
        <TextInput style={styles.input} placeholder="Penyelenggara" value={organizer} onChangeText={setOrganizer} />
        
        <View style={styles.formActions}>
          {editingId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.btnText}>Batal</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.btnText}>{editingId ? 'Update' : 'Tambah Turnamen'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.listTitle}>Daftar Turnamen</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#640000" />
      ) : (
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#640000', marginBottom: 20, textAlign: 'center', paddingTop: 20 },
  formContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#F7FAFC' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  submitBtn: { backgroundColor: '#640000', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#A0AEC0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A202C', marginBottom: 10 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#718096' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#3182CE', padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#E53E3E', padding: 8, borderRadius: 6 },
});
