// TabTwoScreen.tsx
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
<ParallaxScrollView
  headerBackgroundColor={{ light: '#D0EFFF', dark: '#1C1C1C' }}
  headerImage={
    <Image
      source={require('@/assets/images/ceu.png')}
      style={styles.headerImage}
      resizeMode="cover"
    />
  }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Mensagens Celestiais</ThemedText>
      </ThemedView>

      <ThemedText>
        Aqui você encontrará reflexões e ensinamentos que poderão tocar o seu coração.
      </ThemedText>

      <Collapsible title="Sabedoria Divina">
        <ThemedText>
          A cada toque do Espírito, encontramos direção e propósito. Reflita sobre as palavras que
          lhe forem reveladas e deixe que a luz do Altíssimo ilumine seus caminhos.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Como funciona este app?">
        <ThemedText>
          Este aplicativo permite que você pergunte ao Altíssimo e receba respostas geradas por uma inteligência artificial treinada com textos sagrados.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Sinta-se inspirado">
        <ThemedText>
          Conecte-se com o divino, faça suas perguntas e receba respostas inspiradoras. A fé pode se manifestar de formas surpreendentes.
        </ThemedText>
        <Image
          source={require('../../assets/images/cruz2.png')} 
          style={{ alignSelf: 'center', width: 200, height: 200 }} />
          
      </Collapsible>

      <Collapsible title="Mais sobre o projeto">
        <ExternalLink href="https://seusite.com">
          <ThemedText type="link">Saiba mais</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
