import { Box, Button } from '@mui/material';

export default function Header() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, // 画面の上部に固定
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
        justifyContent: 'flex-start',
      }}
    >
      ooooooo
      <Button
        // variant="contained"
        component="a"
        size="small"
        sx={{
          border: 'none', // ボーダーを消す
          padding: '10px', // パディングをゼロにする
          width: '40px', // ボタンの横幅を15pxに指定
          height: '40px', // ボタンの高さも同じく15pxに指定
          minWidth: '40px',
          backgroundColor: 'white',
        }}
      >
        dedwrfrvegubrvuervur
      </Button>
    </Box>
  );
}
