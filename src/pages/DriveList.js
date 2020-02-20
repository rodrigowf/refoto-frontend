import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';


const getContent_url = 'https://refoto.appspot.com/list_drive_files';
const process_url = 'https://refoto.appspot.com/process_folder';

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
        marginBottom : theme.spacing(3),
    },
}));

function DriveList() {
    const [folders, setFolders] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null );

    const classes = useStyles();
    let history = useHistory();

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    useEffect(()=>{getContent()}, []);

    function getContent() {
        axios.get(getContent_url, http_conf)
        .then(res => {
            const result = res.data;
            if(result.running === 'True') {
                history.push("/status");
            } else {
                setFolders(result.list);
            }
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    function process() {
        if(selectedIndex !== null) {
            axios.get(process_url+'/'+selectedIndex, http_conf)
                .then(res => {
                    const result = res.data;
                    if(result.running === 'True'){
                        history.push("/status");
                    } else {
                        console.log('erro!');
                    }
                }).catch(function (error) {
                // handle error
                console.log(error);
            })
        }
    }

    return (
        <div className={classes.root}>
            <Typography variant="h4">
                Escolha aqui uma das pastas do seu Google Drive:
            </Typography>

            <Typography variant="subtitle">
                Depois clique no botão "restaurar" (no final da página) para que todas as fotos
                contidas nesta pasta sejam restauradas automaticamente.
            </Typography>

            <List component="nav" aria-label="main mailbox folders">
                {folders.map(item => (
                    <ListItem
                        button
                        key={item.id}
                        selected={selectedIndex === item.id}
                        onClick={event => handleListItemClick(event, item.id)}
                    >
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                    ))}
            </List>

            <Button variant="contained" color="primary"
                    onClick={process}
                    disabled={selectedIndex === null}>
                Restaurar!
            </Button>
        </div>
    );
}

export default DriveList;