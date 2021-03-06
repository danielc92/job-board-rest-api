module.exports = {
  GET_APPLCATION_LIST: "title",
  GET_JOB_LIST_EMPLOYER: "title job_preview createdAt open",
  GET_JOB_LIST_SEEKER:
    "title job_preview salary_range_low salary_range_high slug createdAt category",
  GET_JOB: "-__v -location -creator_id -updatedAt",
  GET_LOCATION: "location location_string state postcode locality",
  GET_NEWS_LIST: "title summary category createdAt slug",
  GET_PROFILE:
    "summary skills experience education achievements available phone createdAt updatedAt -_id",
  GET_PROFILE_USER_POPULATE:
    "is_employer email first_name last_name createdAt updatedAt saved_searches saved_jobs",
  GET_SKILL: "name",
  GET_USER: "-password -admin -is_employer -activated",

  GET_APPLICATION_LIST_EMPLOYER: "first_name last_name email",
}
