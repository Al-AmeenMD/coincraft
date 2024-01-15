import { Box, Button, TextField } from '@material-ui/core';
import { createUserWithEmailAndPassword } from "@firebase/auth";
import React, { useState } from 'react'
import { CryptoState } from '../../CryptoContext';
import { auth } from "../../firebase";

const Signup = ({handleClose}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { setAlert } = CryptoState();

    const handleSubmit = async() => {
        if(password !== confirmPassword){
            setAlert({
                open: true,
                type: "error",
                message: 'Passwords do not match',
            });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setAlert({
                open: true,
                type: "success",
                message: `Sign Up Successful. Welcome ${result.user.email}`,
            });

            handleClose();
        } catch (error) {
            setAlert({
                open: true,
                type: "error",
                message: error.message,
            });
            return;
        }
    }
  return (
    <Box
        p={3}
        style={{
            display: "flex",
            flexDirection: "column", 
            gap: "20px"
        }}
        >
            <TextField 
                variant="outlined"
                type="email"
                label="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <TextField 
                variant="outlined"
                type="password"
                label="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
            />
            <TextField 
                variant="outlined"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
            />

            <Button 
                variant='contained'
                size='large'
                style={{backgroundColor: "#EEBC1D"}}
                onClick={handleSubmit}
            >
                Sign Up
            </Button>
    </Box>
  )
}

export default Signup