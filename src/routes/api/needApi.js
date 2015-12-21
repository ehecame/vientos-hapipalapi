var NeedController = require('./../../controllers/api/need.js');

module.exports = function () {
    return [
        {
            method: 'GET',
            path: '/api/findneeds',
            config : {
                handler: NeedController.findAll
            }
        },
        {
            method: 'GET',
            path: '/api/findNeeds/ByCategories/{categories_ids}',
            config : {
                handler: NeedController.findAll
            }
        },
        {
            method: 'GET',
            path: '/api/findNeeds/ByKeyWord/{keywords}',
            config : {
                handler: NeedController.findAll
            }
        },
        {
            method: 'GET',
            path: '/api/findNeeds/ByCategories/{categories_ids}/ByKeyWord/{keywords}',
            config : {
                handler: NeedController.findAll
            }
        },
        {
            method: 'GET',
            path: '/api/project/{project_id}/needs',
            config : {
                handler: NeedController.findProjectNeeds
            }
        },
        {
            method: 'POST',
            path: '/api/project/{project_id}/need',
            config : {
                handler : NeedController.insert
            }
        },
        {
            method: 'PUT',
            path: '/api/project/{project_id}/need/{id}',
            config : {
                handler: NeedController.update
            }
        },
        {
            method: 'DELETE',
            path: '/api/project/{project_id}/need/{id}',
            config : {
                handler: NeedController.delete
            }
        }
    ];
}();