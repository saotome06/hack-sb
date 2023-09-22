import { Box } from '@mui/material';
import styles from './style.css';

export default function Home() {
  
  return (
    <Box
      sx={{
        width: '100%',
        margin: 'auto',
      }}
    >
      <label
        style={{
          border: '1px solid black',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto',
          width: '70%',
          marginTop: '50%',
        }}
      >
        <input type="file" capture="environment" accept="image/*" style={{display: 'none'}}></input>
        カメラを起動
      </label>
    </Box>
  )
}
