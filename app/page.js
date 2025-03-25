import { Container, Title, Space } from "@mantine/core";
import ColoredTextGenerator from "./Page/Home";

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      <ColoredTextGenerator />
    </Container>
  );
}
