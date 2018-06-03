import React from 'react'
import { message } from 'antd'

const Common = {

    successMes: value => message.success(value),
      
    errorMes: value => message.error(value),

    warnMes: value => message.warn(value),

    getTextTime: time => {
        const date = new Date(time)
        return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDay()}日${date.getHours()+1}时${date.getMinutes()+1}分${date.getSeconds()+1}秒`
    },

    getNumTime: time => {
        const date = new Date(time)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()+1}-${date.getMinutes()+1}-${date.getSeconds()+1}`
    },

    /*将字符串url回退level级*/
    urlToBack: (url, level) => {
        let arr = url.split('/')
        return arr.slice(0, arr.length-level).join('/')
    },

    /*获取字符串数组和字段名，将各个字符串拼接在字段名上并使用&连接*/
    getConnUrl: (name, arr) => {
        return arr.map( value => {
            return `${name}=${value}`
        }).join('&')
    },

    /* 根据id数组将对象数组中的对应对象删除,返回删除后的对象*/
    deleteSomeObj: (name, id, obj) => {
        return obj.filter( value => {
            return !id.includes(value[name])
        })
    },

    /*将数组arr里的字符串对齐*/
    alignmentArrayString: arr => {
        let max = 0
        arr.forEach( value => {
            let len = value.length
            if(len > max) {
                max = len
            }
        })
        return arr.map( value => {
            return value.padEnd(max)
        })
    }
}

export default Common