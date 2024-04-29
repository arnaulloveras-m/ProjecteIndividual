import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import imagen from './images/imagen.png'
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isTiming, setIsTiming] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [times, setTimes] = useState([]);
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(null); // Nuevo estado para almacenar el índice del tiempo seleccionado
    const [editedTime, setEditedTime] = useState(''); // Estado para almacenar el tiempo editado
    const intervalRef = useRef(null);
    const listRef = useRef(null);
    const keyPressStartTimeRef = useRef(null);
    const [color, setColor] = useState('white');
    const [fontSize, setFontSize] = useState('3em');
    const [combination, setCombination] = useState("");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("3x3");


    // Funciones para manejar el registro de usuario
    // Función para manejar el registro de usuario
// Función para manejar el registro de usuario
    const handleRegister = () => {
        if (localStorage.getItem(username)) {
            alert('El nombre de usuario ya está registrado. Por favor, elige otro.');
            return;
        }

        const user = { username, password, times: [] };
        localStorage.setItem(username, JSON.stringify(user));
        setLoggedInUser(username);
        setUsername('');
        //setPassword('');
    };


    // Función para manejar el inicio de sesión
// Función para manejar el cierre de sesión
    const handleLogout = () => {
        // Guardar los tiempos antes de cerrar sesión
        saveTimesToLocalStorage(times);
        setLoggedInUser(null);
        setTimes([]);
        setUsername('');
        setPassword('');
    };

// Función para cargar los tiempos del localStorage al iniciar la sesión
    const loadTimesFromLocalStorage = (username) => {
        const userJson = localStorage.getItem(username);
        console.log(userJson)
        console.log("User JSON:", userJson); // Verificar el JSON del usuario recuperado
        const user = JSON.parse(userJson);
        console.log("User object:", user); // Verificar el objeto de usuario parseado
        return user && user.times ? user.times : [];
    };

    useEffect(() => {
        // Cargar los tiempos del almacenamiento local al iniciar la aplicación
        if (loggedInUser) {
            const storedTimes = loadTimesFromLocalStorage(username); // Pasar loggedInUser como argumento
            if (Array.isArray(storedTimes)) {
                setTimes(storedTimes);
            } else {
                setTimes([]); // Establecer times como un array vacío si storedTimes no es un array
            }
        }
    }, [loggedInUser]);



    const handleLogin = () => {
        const userJson = localStorage.getItem(username);
        if (userJson) {
            const user = JSON.parse(userJson);
            if (user.password === password) {
                setLoggedInUser(username);
                setTimes(user.times); // Cargar los tiempos del usuario al iniciar sesión
                setUsername('');
                //setPassword('');
            } else {
                alert('Nombre de usuario o contraseña incorrectos.');
            }
        } else {
            alert('Usuario no encontrado.');
        }
    };

    const saveTimesToLocalStorage = (times) => {
        localStorage.setItem(loggedInUser, JSON.stringify({ username: loggedInUser, password: password, times }));
    };


// Función para manejar el registro de tiempos
    const handleTimeRegistration = () => {
        saveTime();
        if (selectedOption === '3x3') {
            setCombination(getRandomCombination(combinations3x3));
        } else if (selectedOption === '2x2') {
            setCombination(getRandomCombination(combinations2x2));
        }
    };




    // Funciones de utilidad para manejar el tiempo
    const timeStringToSeconds = (timeString) => {
        if (typeof timeString !== 'string') {
            return 0; // Si no es una cadena válida, devolver 0 segundos
        }

        const timeParts = timeString.split(':');
        if (timeParts.length !== 2) {
            return 0; // Si la cadena no está en el formato esperado, devolver 0 segundos
        }

        const [minutes, seconds] = timeParts.map(num => parseInt(num));
        return minutes * 60 + seconds;
    };

    const secondsToTimeString = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}s`;
    };

    // Funciones para calcular las medias y los mejores y peores tiempos
    const calculateAverageAllTimes = () => {
        if (times.length === 0) return 0;
        const totalSeconds = times.reduce((acc, cur) => acc + timeStringToSeconds(cur.input), 0);
        return (totalSeconds / times.length).toFixed(2);
    };

    const calculateAverageLast5Times = () => {
        const last5Times = times.slice(Math.max(times.length - 5, 0));
        if (last5Times.length === 0) return 0;
        const totalSeconds = last5Times.reduce((acc, cur) => acc + timeStringToSeconds(cur.input), 0);
        return (totalSeconds / last5Times.length).toFixed(2);
    };

    const calculateAverageLast12Times = () => {
        const last12Times = times.slice(Math.max(times.length - 12, 0));
        if (last12Times.length === 0) return 0;
        const totalSeconds = last12Times.reduce((acc, cur) => acc + timeStringToSeconds(cur.input), 0);
        return (totalSeconds / last12Times.length).toFixed(2);
    };

    const getBestTime = () => {
        if (times.length === 0) return 0;
        const bestTimeInSeconds = Math.min(...times.map(time => timeStringToSeconds(time.input)));
        return secondsToTimeString(bestTimeInSeconds);
    };

    const getWorstTime = () => {
        if (times.length === 0) return 0;
        const worstTimeInSeconds = Math.max(...times.map(time => timeStringToSeconds(time.input)));
        return secondsToTimeString(worstTimeInSeconds);
    };

    const handleScroll = (e) => {
        setScrollPosition(e.target.scrollTop);
    };

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    // Funciones para la navegación de la lista
    const scrollToTop = () => {
        setScrollPosition(0);
    };

    const scrollToBottom = () => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    };

    const combinations = [
        "L2 F U2 B R2 B U2 F2 U2 R2 F U2 L' B D' U2 L F2 L2 B F'",
        "F2 L2 F U2 B L2 U2 F' R2 D2 B R2 U L' U2 L' U' R' D2 B D2 U",
        "F' U2 F2 L B' R2 F2 L' D' L2 D2 B' U2 F' B2 R2 F L2 U2 F",
        "R2 U2 F U2 F' L2 D2 L2 F D2 B2 U2 L' B D2 R' U B2 L D2 U R2",
        "F2 L2 D F2 L2 D B2 R2 B2 U' L2 D2 R U2 B' L2 U2 F D' L' B U'",
        "U' F2 D B2 D' B2 D B2 L2 R2 F2 D' L B' D' F R' U F2 L' B' D2",
        "L F2 L' D2 B2 D2 F2 R2 F2 R U2 B2 D' L' B U' B D B2 F L",
        "B R2 U2 B L2 B2 R2 U2 B' R2 U2 F U' F2 D' R2 F' D' R F L",
        "F2 L2 R2 D2 B U2 R2 B2 L2 F2 D2 U' L' U' L' D' F D' U2 R",
        "L2 F2 U2 L2 F2 U2 L2 D R2 B2 U B' L' B' D' B U' R' U' B2 U'",
        "R2 B2 F2 U' F2 D B2 F2 D L2 F2 L' D' F L' D2 R' D B D2",
        "F U2 B' R2 D2 F L2 F U2 R2 F2 D2 L' F' L' U R' B2 D2 R U'",
        "L2 F2 U2 L2 F2 U2 L2 D R2 B2 U B' L' B' D' B U' R' U' B2 U'",
        "R2 B2 F2 U' F2 D B2 F2 D L2 F2 L' D' F L' D2 R' D B D2",
        "F U2 B' R2 D2 F L2 F U2 R2 F2 D2 L' F' L' U R' B2 D2 R U'"
    ];

    const combinations3x3 = [
        "L2 F U2 B R2 B U2 F2 U2 R2 F U2 L' B D' U2 L F2 L2 B F'",
        "F2 L2 F U2 B L2 U2 F' R2 D2 B R2 U L' U2 L' U' R' D2 B D2 U",
        "F' U2 F2 L B' R2 F2 L' D' L2 D2 B' U2 F' B2 R2 F L2 U2 F",
        "R2 U2 F U2 F' L2 D2 L2 F D2 B2 U2 L' B D2 R' U B2 L D2 U R2",
        "F2 L2 D F2 L2 D B2 R2 B2 U' L2 D2 R U2 B' L2 U2 F D' L' B U'",
        "U' F2 D B2 D' B2 D B2 L2 R2 F2 D' L B' D' F R' U F2 L' B' D2",
        "L F2 L' D2 B2 D2 F2 R2 F2 R U2 B2 D' L' B U' B D B2 F L",
        "B R2 U2 B L2 B2 R2 U2 B' R2 U2 F U' F2 D' R2 F' D' R F L",
        "F2 L2 R2 D2 B U2 R2 B2 L2 F2 D2 U' L' U' L' D' F D' U2 R",
        "L2 F2 U2 L2 F2 U2 L2 D R2 B2 U B' L' B' D' B U' R' U' B2 U'",
        "R2 B2 F2 U' F2 D B2 F2 D L2 F2 L' D' F L' D2 R' D B D2",
        "F U2 B' R2 D2 F L2 F U2 R2 F2 D2 L' F' L' U R' B2 D2 R U'",
        "L2 F2 U2 L2 F2 U2 L2 D R2 B2 U B' L' B' D' B U' R' U' B2 U'",
        "R2 B2 F2 U' F2 D B2 F2 D L2 F2 L' D' F L' D2 R' D B D2",
        "F U2 B' R2 D2 F L2 F U2 R2 F2 D2 L' F' L' U R' B2 D2 R U'"
    ];

    const combinations2x2 = [
        "R F' U' R F U' F R' U2",
        "R2 F2 U R' U F2 U R2 U2",
        "F U R U' R F' U'",
        "F U2 F2 U' F2 U' R U'",
        "U F2 R' F R F' R F' U"
    ];

    const handleModalOpen = () => {
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setModalIsOpen(false);
        if (option === "3x3") {
            setCombination(getRandomCombination(combinations3x3));
        } else if (option === "2x2") {
            setCombination(getRandomCombination(combinations2x2));
        }
    };
    const getRandomCombination = (combinations) => {
        return combinations[Math.floor(Math.random() * combinations.length)];
    };

    // Función para manejar la presentación del modal de edición
    const handleTimeClick = (index) => {
        setSelectedTimeIndex(index);
        setEditedTime(times[index].input); // Establecer el tiempo actual en el estado de tiempo editado
    };

    // Función para manejar el envío del formulario de edición
    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        if (editedTime.trim() !== '') {
            const updatedTime = { ...times[selectedTimeIndex], input: editedTime };
            handleEditTime(updatedTime);
            setSelectedTimeIndex(null);
            setEditedTime('');
        }
    };

    useEffect(() => {
        setCombination(combinations[Math.floor(Math.random() * combinations.length)]);
    }, []);

    const startTimer = () => {
        setStartTime(0);
        setIsTiming(true);
        setElapsedTime(0);
        intervalRef.current = setInterval(() => {
            setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
        }, 1000);
        setColor('white');
    };

    const stopTimer = () => {
        setIsTiming(false);
        clearInterval(intervalRef.current);
        handleTimeRegistration();
    };

    const handleKeyDown = () => {
        keyPressStartTimeRef.current = 0;
        setColor('green');
    };

    const handleKeyUp = () => {
        const keyPressEndTime = Date.now();
        setColor('white');
        setFontSize('3em');
        if (!isTiming) {
            startTimer();
        } else {
            stopTimer();
        }
    };

    const saveTime = () => {
        if (elapsedTime > 0) {
            const timeInSeconds = Math.floor(elapsedTime / 1000);
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = timeInSeconds % 60;
            const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}s`;
            const currentTime = moment().format('h:mm:ss A');
            const usedCombination = combination;
            const updatedTimes = [...times, { time: currentTime, input: time, combination: usedCombination }];
            setTimes(updatedTimes);
        }
    };

    // Función para cargar los tiempos del usuario desde el localStorage al iniciar la sesión
    useEffect(() => {
        if (loggedInUser) {
            const userJson = localStorage.getItem(loggedInUser);
            if (userJson) {
                const user = JSON.parse(userJson);
                setTimes(user.times || []);
            }
        }
    }, [loggedInUser]);


    const handleEditTime = (updatedTime) => {
        const updatedTimes = [...times];
        updatedTimes[selectedTimeIndex] = updatedTime;
        setTimes(updatedTimes);
    };

    return (

        <div className="container">
            <div className="user-info">
                {loggedInUser ? (
                    <p>{loggedInUser}</p>
                ) : (
                    <p>No has iniciado sesión.</p>
                )}
            </div>
            {loggedInUser ? (
                <div>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                    {/* Resto del contenido de la aplicación para usuarios autenticados */}
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleRegister}>Registrarse</button>
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                </div>
            )}
            <div>
                <button className="buttonCube" onClick={handleModalOpen}>Seleccionar Cubo</button>
            </div>
            <div className="header-container">

                <img src={imagen} alt="Descripción de la imagen" className="image"/>
                {selectedOption === "2x2" && <h1>Registro de Tiempos 2x2</h1>}
                {selectedOption === "3x3" && <h1>Registro de Tiempos 3x3</h1>}
                <img src={imagen} alt="Descripción de la imagen" className="image"/>
            </div>
            <div
                className="input-container"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                tabIndex="0"
            >
                {combination && (
                    <div className="combination">{combination}</div>
                )}
                <div className={isTiming ? "timer-container active" : "timer-container"}>
                <span className="timer" style={{ color: color, fontSize: fontSize }}>
                    {moment.utc(elapsedTime).format("mm:ss")}
                </span>
                </div>
            </div>


            {/* Contenedor de la lista de tiempos */}
            <div className="time-list-container">
                <ul className="time-list" ref={listRef}>
                    {times.map((item, index) => (
                        <li key={index} className="time-item" onClick={() => setSelectedTimeIndex(index)}>
                            <span>{item.time}</span> - <span>{item.input}</span> - <span>{item.combination}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sección de estadísticas */}
            <div className="stats-container">
                <h2>Estadísticas</h2>
                <p>Media de todos los tiempos registrados: {secondsToTimeString(calculateAverageAllTimes())}</p>
                <p>Media de los últimos 5 tiempos: {secondsToTimeString(calculateAverageLast5Times())}</p>
                <p>Media de los últimos 12 tiempos: {secondsToTimeString(calculateAverageLast12Times())}</p>
                <p>Mejor tiempo: {getBestTime()}</p>
                <p>Peor tiempo: {getWorstTime()}</p>
            </div>



            {/* Modal de edición */}
            <Modal
                isOpen={selectedTimeIndex !== null}
                onRequestClose={() => setSelectedTimeIndex(null)}
                contentLabel="Editar Tiempo"
                className="Modal" // Agrega la clase para el estilo de la ventana modal
                overlayClassName="ModalOverlay" // Agrega la clase para el estilo del fondo oscuro
            >

                <h2>Editar Tiempo</h2>
                {selectedTimeIndex !== null && (
                    <form onSubmit={handleEditFormSubmit}>
                        <label>
                            Nuevo Tiempo:
                            <input
                                type="text"
                                value={editedTime}
                                onChange={(e) => setEditedTime(e.target.value)}
                            />
                        </label>
                        <button className="close-button" onClick={() => setSelectedTimeIndex(null)}>X</button>
                        <div className="button-container">
                            <button type="submit">Guardar Cambios</button>
                        </div>
                    </form>
                )}
            </Modal>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleModalClose}
                contentLabel="Seleccionar Cubo"
                className="Modal"
                overlayClassName="ModalOverlay"
            >
                <h2>Seleccionar Cubo</h2>
                <div className="modal-options">
                    <button className="buttonCube" onClick={() => handleOptionSelect("3x3")}>3x3</button>
                    <button className="buttonCube" onClick={() => handleOptionSelect("2x2")}>2x2</button>
                </div>
            </Modal>
        </div>
    );
}

export default App;