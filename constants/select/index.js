module.exports = { 
    GET_APPLCATION_LIST: 'title',
    GET_JOB_LIST_EMPLOYER: 'title job_summary createdAt open',
    GET_JOB_LIST_SEEKER: 'title job_summary salary_range_low salary_range_high',
    GET_JOB: '-__v -location -creator_id -updatedAt',
    GET_LOCATION: 'location location_string state postcode locality -_id',
    GET_SKILL: 'name',
    GET_USER: '-password -admin',
}