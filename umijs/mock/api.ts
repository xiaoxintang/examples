import mockjs, {Random} from 'mockjs'

export default {
  'GET /api/list': mockjs.mock({
    'list|5-10':[
      {
        'id|+1':1,
        'title':()=>Random.title(2,8),
        'src':()=>`https://temp.im/466x466/${Random.hex().replace('#','')}/fff`
      }
    ]
  })
}
