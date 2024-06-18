import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography } from "@mui/material";

export default function UrlDialog({ open, handleClose, siteName, setSiteName, siteUrl, setSiteUrl, handleBookmark }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"바로가기 추가"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography sx={{ color: 'black', fontWeight: 500 }}>
            이름
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label=""
            type="text"
            fullWidth
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            sx={{ width: "500px" }}
          />
          <br />
          <br />
          <Typography sx={{ color: 'black', fontWeight: 500, }}>
            URL
          </Typography>
          <TextField
            margin="dense"
            id="url"
            label=""
            type="url"
            fullWidth
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            sx={{ width: "500px" }}
          />
          <br />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          취소</Button>
        <Button onClick={handleBookmark}>
          완료
        </Button>
      </DialogActions>
    </Dialog>
  );
}
