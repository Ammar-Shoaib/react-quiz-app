import { Button, Typography } from '@material-ui/core'
import QuizReview from './QuizReview.jsx'

const TotalResults = ({createMarkup, resetQuiz, classes, processedAnswers, setCurrentQuizStep, currentQuizStep}) => {
    return currentQuizStep === 'results' ? (
        <div className={classes.results}>
            <Typography variant="h1" className={classes.mainTitle}>Results</Typography>
            <Typography variant="h4">
                {processedAnswers.filter(({isCorrect}) => isCorrect).length} out of {" "} {processedAnswers.length}
            </Typography>
            <Button
                color="primary"
                variant="contained"
                className={classes.submitButton}
                onClick={() => setCurrentQuizStep('review')}
            >Review</Button>
            {" "}
            <Button
                color="primary"
                variant="contained"
                className={classes.submitButton}
                onClick={resetQuiz}
            >Reset</Button>
        </div>
    ) : <QuizReview createMarkup={createMarkup} classes={classes} processedAnswers={processedAnswers} resetQuiz={resetQuiz} />
}

export default TotalResults