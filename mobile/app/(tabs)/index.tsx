import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Audio } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const avisos = [
  "Este app não substitui a oração. Use-o como uma ferramenta de reflexão.",
  "Converse com Deus diretamente. Este app é apenas uma inspiração.",
  "Reflita com sabedoria: este app é um apoio, não um substituto da fé.",
  "Use com fé, mas nunca deixe de orar e buscar a Deus em espírito.",
];

const screenHeight = Dimensions.get('window').height;

export default function App() {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [aviso, setAviso] = useState(avisos[Math.floor(Math.random() * avisos.length)]);
  const [musicaTocando, setMusicaTocando] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const theme = useColorScheme();

  useEffect(() => {
    tocarSom();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const tocarSom = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/meditacao.mp3'),
        { shouldPlay: true, isLooping: true, volume: 0.3 }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log('Erro ao carregar som:', e);
    }
  };

  const toggleMusica = async () => {
    if (soundRef.current) {
      if (musicaTocando) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setMusicaTocando(!musicaTocando);
    }
  };

  const perguntar = async () => {
    Keyboard.dismiss(); // ⛔ Oculta o teclado
    setCarregando(true); // ⏳ Mostra carregando
    setResposta('');
    setAviso('');

    try {
      const res = await fetch('http://192.168.0.22:5000/api/perguntar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem }),
      });
      const data = await res.json();
      setResposta(data.resposta);
      setAviso(avisos[Math.floor(Math.random() * avisos.length)]);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error(err);
      setResposta('Erro ao se conectar com o servidor.');
    } finally {
      setCarregando(false); // ✅ Finaliza carregamento
    }
  };

  const darkMode = theme === 'dark';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
        <Image source={require('../../assets/images/cruz.png')} style={styles.logo} />
        <Text style={[styles.title, darkMode && styles.textDark]}>Voz do Altíssimo</Text>

        <TouchableOpacity style={styles.somBotao} onPress={toggleMusica}>
          <MaterialIcons name={musicaTocando ? 'volume-off' : 'volume-up'} size={24} color="#333" />
          <Text style={styles.somTexto}>{musicaTocando ? 'Parar Música' : 'Tocar Música'}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Digite sua pergunta..."
          placeholderTextColor={darkMode ? '#AAA' : '#666'}
          value={mensagem}
          onChangeText={setMensagem}
          style={[styles.input, darkMode && styles.inputDark]}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={perguntar} disabled={carregando}>
          <Text style={styles.buttonText}>Perguntar a Deus</Text>
        </TouchableOpacity>

        <ScrollView style={styles.respostaScroll} contentContainerStyle={styles.respostaBox}>
          {carregando ? (
            <View style={styles.loadingBox}>
              <Text style={[styles.carregandoTexto, darkMode && styles.textDark]}>
                Deus está refletindo...
              </Text>
              <ActivityIndicator size="large" color="#6C63FF" />
            </View>
          ) : (
            <>
              <Animated.Text style={[styles.resposta, { opacity: fadeAnim }, darkMode && styles.textDark]}>
                {resposta}
              </Animated.Text>
              <Text style={[styles.aviso, darkMode && styles.textDark]}>{aviso}</Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#222',
    color: '#FFF',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  respostaScroll: {
    maxHeight: screenHeight * 0.4,
    marginBottom: 20,
  },
  respostaBox: {
    backgroundColor: '#EFEFEF',
    padding: 16,
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  resposta: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  aviso: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  textDark: {
    color: '#FFF',
  },
  somBotao: {
    backgroundColor: '#0000',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  somTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  carregandoTexto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
