import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import imagen from './images/imagen.png'
import './App.css';

function App() {
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
        "F U2 B' R2 D2 F L2 F U2 R2 F2 D2 L' F' L' U R' B2 D2 R U'",
    ];

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
        saveTime();
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
            setTimes([...times, { time: currentTime, input: time, combination: usedCombination }]);
            setElapsedTime(0);
            setCombination(combinations[Math.floor(Math.random() * combinations.length)]);
        }
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);


    const handleEditTime = (updatedTime) => {
        const updatedTimes = [...times];
        updatedTimes[selectedTimeIndex] = updatedTime;
        setTimes(updatedTimes);
        // Cierra el modal de edición aquí
    };

    return (
        <div className="container">
            <div className="header-container">
                <img src={imagen} alt="Descripción de la imagen" className="image"/>
                <h1>Registro de Tiempos</h1>
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
            <ul className="time-list" ref={listRef}>
                {times.map((item, index) => (
                    <li key={index} className="time-item" onClick={() => handleTimeClick(index)}>
                        <span>{item.time}</span> - <span>{item.input}</span> - <span>{item.combination}</span>
                    </li>
                ))}
            </ul>

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
        </div>
    );
}

export default App;
