// TODO: Add error messages for ease in testing
const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema({
  // Group's name
  name: { type: String, required: true, unique: true },
  // Members of the group
  members: { type: [Array], default: [] },
})

class TeamsModel {
  /**
   * Creates  DB instance of the teams collection
   */
  constructor() {
    this.DB = mongoose.model('teams', teamsSchema)
  }

  /**
   * Formats the group name given to match the semester and year
   *
   * @example
   * `SDC - Algorithms - Fall 2018
   *
   * @param {string} groupName - the name for the group
   * @param {boolean} exact - whether or not to save the exact name of the group name
   * @return {string} - the formatted string
   */
  static formatGroupName(groupName) {
    let formattedName = groupName;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getYear();

    // May - December is considered Fall, everything else is Spring
    const season = currentMonth > 4 && currentMonth <= 11 ? 'Fall' : 'Spring';

    // Gets the last two digits of the year
    const year = currentYear.toString().slice(1, 3);

    formattedName = `SDC - ${groupName} - ${season} ${year}`;

    return formattedName;
  }

  /**
   * Should create a new Team
   *
   * @param {string} name - formmated name of group
   * @return {object} createdTeam - the team we just created with no members
   */
  async createNewTeam(name) {
    try {
      const newTeam = new this.DB({ name })
      const createdTeam = await newTeam.save()
      return createdTeam
    } catch (err) {
      console.error(err)
      throw err // TODO: Replace this error with a pre defined error
    }
  }

  /**
   * Get a team's members
   *
   * @param {string} name formmated name of group
   */
  getTeamMembers(targetGroup) {
    // TODO: Fill in this method
    console.log(this.DB)
    console.log(targetGroup)
  }

  /**
   * Get all of the data from the database
   */
  getAllTeams() {
    // TODO: Fill in this method
    console.log(this.DB)
  }

  /**
   * Update a group's members
   *
   * @param {string} targetGroup name of the group in the database
   * @param {string} emailToAdd email of the user to add to the group
   */
  updateTeam(targetGroup, emailToAdd) {
    // TODO: Fill in this method
    console.log(this.DB)
    console.log({ targetGroup, emailToAdd })
  }

  /**
   * Delete a group's members
   *
   * @param {string} targetGroup name of the group in the database
   * @param {string} emailToAdd email of the user to delete from the group
   */
  deleteEmailFromTeam(targetGroup, emailToDelete) {
    // TODO: Fill in this method
    console.log(this.DB)
    console.log({ targetGroup, emailToDelete })
  }
}

exports = TeamsModel
