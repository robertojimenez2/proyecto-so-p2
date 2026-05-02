import React, { useState } from "react";

function Ejercicios() {
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "¿Qué es la memoria virtual?",
      options: [
        "RAM física",
        "Extensión de RAM usando disco",
        "Caché del procesador",
      ],
      correct: 1,
    },
    {
      id: 2,
      question: "¿Cuál es el estado inicial de un proceso?",
      options: ["Ejecutando", "Nuevo", "Bloqueado"],
      correct: 1,
    },
  ];

  const handleAnswer = (qid, ans) => {
    setAnswers({ ...answers, [qid]: ans });
  };

  return (
    <div>
      <h1>Ejercicios Teórico-Prácticos</h1>
      {questions.map((q) => (
        <div key={q.id} className="quiz">
          <h3>{q.question}</h3>
          {q.options.map((opt, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`q${q.id}`}
                value={idx}
                onChange={() => handleAnswer(q.id, idx)}
              />
              {opt}
            </label>
          ))}
          {answers[q.id] !== undefined && (
            <p
              className={answers[q.id] === q.correct ? "correct" : "incorrect"}
            >
              {answers[q.id] === q.correct ? "Correcto!" : "Incorrecto"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Ejercicios;
