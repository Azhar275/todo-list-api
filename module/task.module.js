const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi =  require('joi');
const jwt = require('jsonwebtoken');

const _hash = require(`${__class_dir}/hash.class.js`);

class _task{
    add(data, autHeader){

        // Validate data
        const schema = Joi.object({
            item: Joi.string()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(data)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }
        const token = autHeader && autHeader.split(' ')[1]
        const user_id = Number(jwt.decode(token))

        // Insert data to database
        const sql = {
            query: `INSERT INTO task (items, user_id) VALUES (?, ?)`,
            params: [data.item, user_id]
        }

        return mysql.query(sql.query, sql.params)
            .then(data=>{
                return {
                    status: true,
                    data
                }
            })
            .catch(error =>{
                if (debug){
                    console.error('add task Error: ', error)
                }

                return{
                    status: false,
                    error
                }
            })
    }

    update(dataBody, autHeader){

        // Validate data
        const schema = Joi.object({
            nItem: Joi.string(),
            item_id: Joi.number()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(dataBody)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }
        const token = autHeader && autHeader.split(' ')[1]
        const user_id = jwt.decode(token)
        // Update data to database
        const sql = {
            query: `
            SELECT * FROM task
            WHERE id = ?
            `,
            params: [dataBody.item_id]
        }

        return mysql.query(sql.query, sql.params)
            .then(data=>{
                if(data[0].user_id === Number(user_id)){
                    const sql = {
                        query: `
                        UPDATE task
                        SET items = ?
                        WHERE id = ?
                        `,
                        params: [dataBody.nItem, dataBody.item_id]
                    }
                    return mysql.query(sql.query, sql.params)
                    .then(data=>{
                        return {
                            status: true,
                            data
                        }
                    })
                    .catch(error =>{
                        if (debug){
                            console.error('add task Error: ', error)
                        }
        
                        return{
                            status: false,
                            error
                        }
                    })
                } else {
                    return {
                        status: false,
                        message: `Not your item, wrong user id`
                    }
                }
                
                
            })
            .catch(error =>{
                if (debug){
                    console.error('update task Error: ', error)
                }

                return{
                    status: false,
                    error
                }
            })
    }

    delete(dataBody, autHeader){

        // Validate data
        const schema = Joi.object({
            item_id: Joi.number()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(dataBody)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        const token = autHeader && autHeader.split(' ')[1]
        const user_id = jwt.decode(token)

        // Update data to database
        const sql = {
            query: `
            SELECT * FROM task
            WHERE id = ?
            `,
            params: [dataBody.item_id]
        }

        return mysql.query(sql.query, sql.params)
        .then(data=>{
            if(data[0].user_id === Number(user_id)){
                const sql = {
                    query: `
                    DELETE FROM task
                    WHERE id = ?
                    `,
                    params: [dataBody.item_id]
                }
                return mysql.query(sql.query, sql.params)
                .then(data=>{
                    return {
                        status: true,
                        data
                    }
                })
                .catch(error =>{
                    if (debug){
                        console.error('add task Error: ', error)
                    }
    
                    return{
                        status: false,
                        error
                    }
                })
            } else {
                return {
                    status: false,
                    message: `Not your item, wrong user id`
                }
            }
            
        })
        .catch(error =>{
            if (debug){
                console.error('update task Error: ', error)
            }

            return{
                status: false,
                error
            }
        })
    }
    getAll(autHeader){

        const token = autHeader && autHeader.split(' ')[1]
        const user_id = jwt.decode(token)
        const sql = {
            query: `
            SELECT * FROM task
            WHERE user_id = ?
            `,
            params: [user_id]
        }

        return mysql.query(sql.query, sql.params)
            .then(data=>{
                return {
                    status: true,
                    data
                }
            })
            .catch(error =>{
                if (debug){
                    console.error('update task Error: ', error)
                }

                return{
                    status: false,
                    error
                }
            })
    }
}

module.exports = new _task();
