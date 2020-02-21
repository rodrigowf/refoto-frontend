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
import PhotoIcon from "@material-ui/icons/Photo";


const status_url = '/get_status';
const filelist_url = '/get_filelist';
const cancel_url = '/cancel_processing';

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

function useProgress(filesList, currentFileKey, currentProgress) {
    const [progressArray, setProgressArray] = useState([]);

    useEffect(() => {
        let progArr = [];
        filesList.map((item, key) => {
            if(currentFileKey < key) {
                progArr.push(0);
            } else if(currentFileKey > key) {
                progArr.push(100);
            } else if(currentFileKey === key) {
                progArr.push(currentProgress);
            }
        });
        setProgressArray(progArr);
    }, [currentFileKey, currentProgress]);

    return progressArray;
}


function Status() {
    const [filesList,   setFilesList]   = useState([]);
    const [folderName,  setFolderName]  = useState('');
    const [currentFile, setCurrentFile] = useState(0);
    const [progress,    setProgress]    = useState(0);

    const classes = useStyles();
    let history = useHistory();

    const progressArr = useProgress(filesList, currentFile, progress);


    function getFileList() {
        axios.get(filelist_url, http_conf)
            .then(res => {
                const result = res.data;
                if (result.running === 'False') {
                    history.push("/");
                } else if (result.running === 'True') {
                    if(Array.isArray(result.folder_name) && result.folder_name.length > 0) {
                        setFolderName(result.folder_name);
                        setFilesList(result.files_list);
                    }
                    else {
                        setTimeout(()=>{getFileList()}, 500);
                    }
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
        let inter = setInterval(()=>{getStatus()}, 1000);
        return () => {
            clearInterval(inter);
        }
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
                            <PhotoIcon />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <LinearProgress variant="determinate" value={progressArr[key]} />
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