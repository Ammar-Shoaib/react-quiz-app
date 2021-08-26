import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import TotalResults from './TotalResults'

const QuizAnswers = ({classes, quizData, createMarkup, resetQuiz, currentQuizStep, setCurrentQuizStep}) => {

    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [processedAnswers, setProcessedAnswers] = useState([])

    const handleAnswer = (e) => {
        e.preventDefault()

        const processedAnswers = selectedAnswers.map(({answer, question}) => {
            const relatedQuestion = quizData.find(category => category.question === question)
            if(relatedQuestion.correct_answer === answer) {
                return {
                    correctAnswer:answer,
                    isCorrect:true,
                    question
                }
            }
            return {
                correctAnswer:relatedQuestion.correct_answer,
                wrongAnswer:answer,
                isCorrect:false,
                question
            }
        })
        setProcessedAnswers(processedAnswers)
    }   

    const relatedAnswer = (question, selectedAnswers) => {
        if(selectedAnswers && selectedAnswers.length) {
            const relatedQuestion = selectedAnswers.find(answer => answer.question === question)
            return (relatedQuestion && relatedQuestion.answer) || "" 
        }
        return ""
    }

    const handleAnswerChange = (e, selectedQuestion) => {
        e.preventDefault()
        const { value } = e.target

        const isExistQuestion = selectedAnswers.length && selectedAnswers.find(answer => answer.question ===  selectedQuestion)
        if(isExistQuestion && isExistQuestion.answer) {
            const updatedAnswers = selectedAnswers.map(answer => {
                if(answer.question === selectedQuestion) {
                    return {
                        question:selectedQuestion,
                        answer:value
                    }
                }
                return answer
            })
            setSelectedAnswers(updatedAnswers)
        } else {
            setSelectedAnswers([
                ...selectedAnswers,
                {
                    question:selectedQuestion,
                    answer:value
                }
            ])
        }
    }

    return !processedAnswers.length ? (
        <div>
            <Typography variant='h1' className={classes.mainTitle}>Answer Following Questions:</Typography>
            <form onSubmit={handleAnswer}>
                <Grid container>
                    <Grid item xs={12}>
                        {quizData.map(quiz => (
                            <Paper className={classes.paper}>
                                <Typography variant="h5" key={quiz.question} className={classes.question}>
                                    <span dangerouslySetInnerHTML={createMarkup(quiz.question)} />
                                </Typography>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="select-answer-label">Select Answer</InputLabel>
                                    <Select
                                        name='answer'
                                        value={relatedAnswer(quiz.question, selectedAnswers) || ""}
                                        onChange={(e) => handleAnswerChange(e, quiz.question)}
                                        label="Selected Answer"
                                        labelId="select-answer-label"
                                        required
                                    >
                                        {quiz.answers.map(answer => (
                                            <MenuItem key={answer} value={answer}>
                                                <span dangerouslySetInnerHTML={createMarkup(answer)} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                        ))}
                        <Button
                            type='submit'
                            color="primary"
                            className={classes.submitButton}
                            variant='contained'
                        >
                            Result
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    ) : <TotalResults resetQuiz={resetQuiz} currentQuizStep={currentQuizStep} setCurrentQuizStep={setCurrentQuizStep} classes={classes} processedAnswers={processedAnswers} createMarkup={createMarkup} />
}

export default QuizAnswers
