import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {useState} from "react";

export default function PlacesDialog({ open, handleClose, storeName, storeAddress, storeContact, handleBookmark }) {
  const [hover, setHover] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"가게 정보"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          이름: {storeName} <br />
          주소: {storeAddress} <br />
          전화번호: {storeContact}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>닫기</Button>
        <Button onClick={handleBookmark} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
             {hover ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </Button>
      </DialogActions>
    </Dialog>
  );
}
