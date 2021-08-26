import React, { useState, useEffect } from 'react'
import {Button, Container, FormControl, InputLabel, makeStyles, Grid, MenuItem, Paper, Select, TextField, Typography} from '@material-ui/core'
import axios from 'axios'
import QuizAnswers from './QuizAnswers'
import { LineWeight } from '@material-ui/icons'

const createMarkup = text => {
    return { __html: text }
}

const difficulties = [
    {id:"total_easy_question_count", name:"easy"},
    {id:"total_medium_question_count", name:"medium"},
    {id:"total_hard_question_count", name:"hard"}
]

const useStyles = makeStyles(theme => ({
    paper:{
        padding:"20px",
        marginTop:"20px",
        marginBottom:"20px",
        borderRadius:"20px",
        boxShadow:"0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.13)"
    },
    mainTitle: {
        fontSize:"45px",
        marginBottom:"20px"
    },
    submitButton: {
        borderRadius:"999px",
        background:"#9c27b0",
        marginTop:"20px",
        "&:hover": {
            background:"#681a75",
            boxShadow:"0 14px 26px -12px rgba(156, 39, 176, 0.42), 0 4px 23px 0 rgba(0, 0, 0, 0.12), 0 8px 16px 26px rgba(0, 0, 0, 0.15)"
        }
    },
    question: {
        fontSize:"24px",
        marginBottom:"10px",
        fontWeight:"500",
        lineHeight:"35px"
    },
    answer: {
        display:"flex",
        fontSize:"18px",
        marginLeft:"5px",
        lineHeight:"25px",
        marginBottom:"5px"
    },
    correctAnswer: {
        color:"green"
    },
    results: {
        display:"flex",
        flexDirection:"column",
        width:"150px",
        margin:"0 auto"
    }
}))

const QuizCategories = () => {

    const classes = useStyles()

    const [quizData, setQuizData] = useState([])
    const [quizCategories, setQuizCategories] = useState([])
    const [quizNumber, setQuizNumber] = useState("")
    const [category, setCategory] = useState({})
    const [difficulty, setDifficulty] = useState({})
    const [currentQuizStep, setCurrentQuizStep] = useState('start')

    const fetchQuizData = async () => {
        const { data } = await axios.get(`https://opentdb.com/api.php?amount=${quizNumber}&category=${category.id}&difficulty=${difficulty.name.toLowerCase()}`)
        const formattedData = data.results.map(category => {
            const incorrectAnswersIndexes = category.incorrect_answers.length
            const random = Math.random () * (incorrectAnswersIndexes - 0) + 0
            category.incorrect_answers.splice(random, 0, category.correct_answer)
            return {
                ...category,
                answers: category.incorrect_answers
            }
        })
        setCurrentQuizStep('results')
        setQuizData(formattedData)
    }

    const fetchQuizCategories = async () => {
        const { data } = await axios.get(`https://opentdb.com/api_category.php`)
        setQuizCategories(data.trivia_categories)
    }

    useEffect(() => {
        fetchQuizCategories()
    }, [])

    const handleCategorySelect = (e) => {
        e.preventDefault()
        const catSelect = quizCategories.find(cat => cat.id === e.target.value)
        setCategory(catSelect)
    }

    const handleDifficultySelect = (e) => {
        e.preventDefault()
        const diffSelect = difficulties.find(diff => diff.id === e.target.value)
        setDifficulty(diffSelect)
    }

    const handleChange = e => {
        e.preventDefault()
        setQuizNumber(e.target.value)
    }

    const resetQuiz = e => {
        e.preventDefault()
        setQuizData([])
        setCategory({})
        setDifficulty({})
        setQuizNumber("")
        setCurrentQuizStep('start')
    }

    const handleSubmit = e => {
        e.preventDefault()
        if(!quizData.length && category.id && difficulty && quizNumber) {
            fetchQuizData()
        }
    }

    return (
        <Container>
            <Paper className={classes.paper}>
                {currentQuizStep === 'start' ? 
                <div>
                    <Typography className={classes.mainTitle}>Category Questions:</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="select-category-label">Select Category</InputLabel>
                                    <Select
                                        name='category'
                                        value={category.id || ""}
                                        onChange={handleCategorySelect}
                                        label="Select Category"
                                        labelId="select-category-label"
                                        required
                                    >
                                        {quizCategories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                <span dangerouslySetInnerHTML={createMarkup(category.name)} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="select-difficulty-label">Select Difficulty</InputLabel>
                                    <Select
                                        name='difficulty'
                                        value={difficulty.id || ""}
                                        onChange={handleDifficultySelect}
                                        label="Select Difficulty"
                                        labelId="select-difficulty-label"
                                        required
                                    >
                                        {difficulties.map(difficulty => (
                                            <MenuItem key={difficulty.id} value={difficulty.id}>
                                                <span dangerouslySetInnerHTML={createMarkup(difficulty.name)} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name='quizNumber'
                                    value={quizNumber || ""}
                                    onChange={handleChange}
                                    label='Add a number from 1 to 10'
                                    required
                                    variant="outlined"
                                    fullWidth
                                    inputProps={{min:1, max:10}}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type='submit'
                            className={classes.submitButton}
                            variant='contained'
                            color="primary"
                        >Submit</Button>
                    </form>
                </div> : <QuizAnswers createMarkup={createMarkup} quizData={quizData} classes={classes} currentQuizStep={currentQuizStep} setCurrentQuizStep={setCurrentQuizStep} resetQuiz={resetQuiz} /> }
            </Paper>
        </Container>
    )
}

export default QuizCategories
