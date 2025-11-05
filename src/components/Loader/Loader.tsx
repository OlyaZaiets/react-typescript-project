import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './Loader.scss';


export function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box position='relative' display='inline-flex'>
      <CircularProgress variant='determinate' 
      {...props} 
      sx={{ color: '#ffde59' }} 
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Typography 
          variant='caption' 
          component='div' 
          sx={{
          fontSize: '2rem',
          fontFamily: 'Merriweather, serif',
          fontWeight: 600,
          color: '#ffde59',
          textShadow: '0 0 8px #ffde59',
          }}
          >{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function CircularStatic() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} />;
}

export function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}
