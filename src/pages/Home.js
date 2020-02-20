import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from "axios";

const backend_url = 'http://refoto.appspot.com/do_authorize';
const status_url = 'http://refoto.appspot.com/get_status';

const http_conf = {
    withCredentials: true,
    headers: {
        // "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE" ,
        "Content-Type": "application/json;charset=UTF-8"
    }};
 

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        marginTop: theme.spacing(2),
        marginBottom : theme.spacing(3),
    },
    google_button: {
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
}));

function Home() {
    const classes = useStyles();

    useEffect(()=>{testStatus()}, []);

    function testStatus() {
        axios.get(status_url, http_conf)
            .then(res => {
                const result = res.data;
                if(result.running === 'True') {
                    history.push("/status");
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    function authorize() {
        axios.get(backend_url, http_conf)
             .then(res => {
                const result = res.data;
                window.location.href = String(result);
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    return (
        <Box className={classes.root}>
            {/* Hero unit */}
            <div className={classes.heroContent}>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Bem-vindo ao ReFoto!
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph>
                        Seu maravilhoso restaurador automático de fotos antigas
                    </Typography>
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button className={classes.google_button}
                                        variant="contained"
                                        color="primary"
                                        onClick={authorize}
                                >
                                    Restaurar álbum do meu Google Drive
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary">
                                    Enviar fotos a partir do meu computador
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
            {/* End hero unit */}
        </Box>
    );
}

export default Home;