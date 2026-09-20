import {
  Box, Typography, Button, Card, CardMedia, CardContent,
  Chip, Container, Stack, useTheme,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import GroupsIcon from '@mui/icons-material/GroupsOutlined';
import SecurityIcon from '@mui/icons-material/SecurityOutlined';
import ArrowIcon from '@mui/icons-material/ArrowForwardOutlined';
import SparkleIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CARDS = [
  {
    title: 'SQL',
    description: 'Run blazing-fast SQL, experiment instantly, and optimize like a pro.',
    icon: BoltIcon,
    gradient: 'linear-gradient(135deg, #4096ff 0%, #36cfc9 100%)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    link: '/sql',
  },
  {
    title: 'NoSQL',
    description: 'Work with teammates, share results, and collaborate in real-time.',
    icon: GroupsIcon,
    gradient: 'linear-gradient(135deg, #9254de 0%, #f759ab 100%)',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60',
    link: '/nosql',
  },
  {
    title: 'Vector DB',
    description: 'Your data stays protected with enterprise-grade security.',
    icon: SecurityIcon,
    gradient: 'linear-gradient(135deg, #52c41a 0%, #36cfc9 100%)',
    image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=60',
    link: '/vector-database',
  },
];

export default function Landing() {
  const theme    = useTheme();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.25 }}>
        <Box sx={{ position: 'absolute', top: 80,  left: 40,  width: 288, height: 288, borderRadius: '50%', bgcolor: 'primary.main',  filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: 80, right: 40, width: 384, height: 384, borderRadius: '50%', bgcolor: '#9254de', filter: 'blur(80px)' }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', py: 8 }}>
        {/* Hero */}
        <Stack alignItems="center" textAlign="center" spacing={3} sx={{ mb: 8 }}>
          <Chip
            icon={<SparkleIcon sx={{ fontSize: '14px !important', color: '#36cfc9 !important' }} />}
            label="The Future of SQL Development"
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'primary.light',
              color: 'primary.main',
              bgcolor: 'primary.lighter',
              fontWeight: 500,
              px: 1,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #4096ff, #36cfc9, #9254de)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BrewQuery
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{ maxWidth: 560, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7 }}
          >
            A lightning-fast, modern SQL playground with powerful tools built for
            developers, teams, and data enthusiasts.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/sql')}
              sx={{
                px: 4, py: 1.5,
                background: 'linear-gradient(90deg, #1677ff, #36cfc9)',
                boxShadow: '0 8px 20px rgba(22,119,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0958d9, #13c2c2)',
                  boxShadow: '0 12px 28px rgba(22,119,255,0.4)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Watch Demo
            </Button>
          </Stack>
        </Stack>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {CARDS.map((card, idx) => {
            const Icon = card.icon;
            const isHovered = hovered === idx;

            return (
              <Card
                key={card.title}
                elevation={isHovered ? 8 : 1}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme.palette.divider}`,
                }}
                onClick={() => card.link && navigate(card.link)}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={card.image}
                    alt={card.title}
                    sx={{
                      height: '100%',
                      objectFit: 'cover',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  {/* Gradient overlay */}
                  <Box sx={{ position: 'absolute', inset: 0, background: card.gradient, opacity: isHovered ? 0.55 : 0.35, transition: 'opacity 0.4s' }} />

                  {/* Floating icon */}
                  <Box
                    sx={{
                      position: 'absolute', top: 16, right: 16,
                      p: 1.25,
                      background: card.gradient,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      transform: isHovered ? 'scale(1.12) rotate(12deg)' : 'scale(1)',
                      transition: 'transform 0.4s',
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {card.description}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowIcon />}
                    sx={{
                      p: 0,
                      background: card.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'transparent' },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>

                {/* Bottom gradient bar */}
                <Box
                  sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: card.gradient,
                    transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s ease',
                  }}
                />
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
