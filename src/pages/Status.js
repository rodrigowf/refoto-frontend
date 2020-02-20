import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import FolderIcon from "@material-ui/icons/Photo";


const status_url = 'http://refoto.appspot.com/get_status';
const filelist_url = 'http://refoto.appspot.com/get_filelist';
const cancel_url = 'http://refoto.appspot.com/cancel_processing';

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

function useProgress(myFileKey, currentFileKey, currentProgress) {
    const [myProgress, setMyProgress] = useState(0);

    useEffect(() => {
        if(currentFileKey < myFileKey) {
            setMyProgress(0);
        } else if(currentFileKey > myFileKey) {
            setMyProgress(100);
        } else if(currentFileKey === myFileKey) {
            setMyProgress(currentProgress);
        }
    }, [currentFileKey, currentProgress]);

    return myProgress;
}


function Status() {
    const [filesList,   setFilesList]   = useState([]);
    const [folderName,  setFolderName]  = useState('');
    const [currentFile, setCurrentFile] = useState([]);
    const [progress,    setProgress]    = useState(0);

    const classes = useStyles();
    let history = useHistory();

    function getFileList() {
        axios.get(filelist_url, http_conf)
            .then(res => {
                const result = res.data;
                if (result.running === 'False') {
                    history.push("/");
                } else if (result.running === 'True') {
                    setFolderName(result.folder_name);
                    setFilesList(result.files_list);
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    useEffect(() => {
        getFileList();
    }, []);

    function getStatus() {
        axios.get(status_url, http_conf)
            .then(res => {
                const result = res.data;
                if(result.running === 'False') {
                    history.push("/");
                } else {
                    setCurrentFile(result.current_file);
                    setProgress(result.progress)
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    useEffect(() => {
        getStatus();
        setInterval(()=>{getStatus()}, 1000);
    }, []);

    function cancelOperation() {
        axios.get(cancel_url, http_conf)
            .then(res => {
                const result = res.data;
                if(result.running === 'False') {
                    history.push("/");
                }
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    return (
        <div className={classes.root}>
            <Typography variant="h4">
                Seus arquivos estão sendo processados...
            </Typography>
            <Typography variant="subtitle">
                Quando terminar, todos serão salvos na pasta: {folderName}_resultado.
            </Typography>

            <List component="nav" aria-label="main mailbox folders">
                {filesList.map((item, key) => (
                    <ListItem
                        key={item.id}
                    >
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <LinearProgress variant="determinate" value={useProgress(key, currentFile, progress)} />
                    </ListItem>
                ))}
            </List>

            <Button variant="contained"
                    onClick={cancelOperation} >
                Cancelar
            </Button>
        </div>
    );
}

export default Status;