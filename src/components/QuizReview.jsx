import { Button, Paper, Typography } from '@material-ui/core'
import { Check, Close } from '@material-ui/icons'
import React from 'react'

const QuizReview = ({resetQuiz, processedAnswers, classes, createMarkup}) => {

    const renderAnswers = (answer) => {
        return answer.map(({question, correctAnswer, wrongAnswer, isCorrect}) => (
            <Paper className={classes.paper}>
                <Typography variant="h2" className={classes.question}>
                    <span dangerouslySetInnerHTML={createMarkup(question)} />
                </Typography>
                {isCorrect ? (
                    <Typography variant="h2" className={`${classes.answer} ${classes.correctAnswer}`}>
                        <Check />
                        <span dangerouslySetInnerHTML={createMarkup(correctAnswer)} className={classes.answer} />
                    </Typography>
                ) : (
                    <>
                        <Typography variant="h3" className={classes.answer} color="secondary" >
                            <Close />
                            <span dangerouslySetInnerHTML={createMarkup(wrongAnswer)} className={classes.answer}/>
                        </Typography>
                        <Typography variant="h3" className={`${classes.answer} ${classes.correctAnswer}`}>
                            <Check />
                            <span dangerouslySetInnerHTML={createMarkup(correctAnswer)} className={classes.answer} />
                        </Typography>
                    </>
                )}
            </Paper>
        ))
    }

    return (
        <div>
            <Typography variant="h1" className={classes.mainTitle}>Answers Review:</Typography>
            {renderAnswers(processedAnswers)}
            <Button
                color="primary"
                className={classes.submitButton}
                variant="contained"
                onClick={resetQuiz}
            >
                Reset
            </Button>
        </div>
    )
}

export default QuizReview
