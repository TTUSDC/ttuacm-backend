import React from 'react'
import Grid from '@material-ui/core/Grid'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import useWindowSize from 'context/withWindowSize'
import FooterTopSection from './FooterTopSection'
import { sections } from './FooterInfo'

const styles = {
  FooterTop: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '95%',
    margin: '18px auto 30px',
  },
}

const FooterTop = ({ classes = {}, currentPage, theme, ...props }) => {
  const handleNavigation = (nextPage) => () => {
    if (currentPage !== nextPage) {
      props.push(nextPage)
    }
  }

  const { width } = useWindowSize()
  let filteredSections = sections
  if (theme.breakpoints.values.sm > width) {
    filteredSections = sections.filter(
      ({ title }) => title.toLowerCase() === 'contact us',
    )
  }

  return (
    <Grid container className={classes.FooterTop} spacing={32} direction='row'>
      {filteredSections.map(
        ({ title, description, containsAppLink, containsOutsideLink }) => (
          <FooterTopSection
            key={title}
            title={title}
            description={description}
            handleNavigation={containsAppLink ? handleNavigation : () => {}}
            containsAppLink={containsAppLink}
            containsOutLink={containsOutsideLink}
          />
        ),
      )}
    </Grid>
  )
}

FooterTop.propTypes = {
  classes: PropTypes.shape({}),
  currentPage: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  theme: PropTypes.shape({}).isRequired,
}

const mapStateToProps = (state) => ({
  currentPage: state.router.location.pathname,
})

export default connect(
  mapStateToProps,
  { push },
)(withStyles(styles, { withTheme: true })(FooterTop))