import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Profile from 'assets/teams_page/profile.jpg'
import { withStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import classnames from 'classnames'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/Favorite';
import EmailIcon from '@material-ui/icons/Email';
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  Image: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
})

function TeamCard({ preventJoin, name, leader, description, email, day, time, classes }) {
  const [open, setOpen] = useState(false)

  // Turns the array of days to a comma separated string
  const fmtDays = (days) => {
    if (days.length < 1) {
      throw Error('days.length must be greater than 0')
    }

    let res = ''
    for (const eachDay of days) {
      res += `${eachDay}, `
    }

    // Gets rid of the trailing space and comma
    return res.slice(0, res.length - 2)
  }

  return (
    <Card>
      <CardMedia
        image={Profile}
        title={name}
        className={classes.Image}
      />
      <CardContent>
        <Typography
          variant='h5'
          style={{ fontWeight: 'bold' }}
          gutterBottom
        >
          {name}
        </Typography>
        <Typography
          variant='body1'
        >
          Led by {leader}
        </Typography>
        <Typography
          variant='body1'
          gutterBottom
        >
          {fmtDays(day)} @ {time}
        </Typography>
      </CardContent>
      <CardActions disableActionSpacing>
        <IconButton
          aria-label='Add to groups'
          disabled={preventJoin}
          onClick={() => console.log('adding group to the user')}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton
          aria-label='Email'
          onClick={() => console.log(`send email to ${email}`)}
        >
          <EmailIcon />
        </IconButton>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: open,
          })}
          onClick={() => setOpen(!open)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={open} timeout='auto' unmountOnExit>
        { preventJoin ? (
          <CardContent>
            <Typography
              variant='h6'
              style={{ textAlign: 'center', fontWeight: 'bold' }}
            >
            Please login to sign up for classes
            </Typography>
          </CardContent>
        ) : null
        }
        <CardContent>
          <Typography paragraph>{description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
TeamCard.propTypes = {
  name: PropTypes.string.isRequired,
  leader: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  day: PropTypes.arrayOf(PropTypes.string).isRequired,
  time: PropTypes.string.isRequired,
  preventJoin: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}),
}

TeamCard.defaultProps = {
  classes: {},
}

export default withStyles(styles)(TeamCard)
