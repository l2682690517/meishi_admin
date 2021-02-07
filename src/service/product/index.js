import * as R from 'ramda'
import R_ from 'src/util/R_'
import * as ResourceService from 'src/service/resource/index'

export const allTp = {
  platform: {
    value: 1,
    text: ''
  },
  self_support: {
    value: 2,
    text: '自营'
  },
  choose_platform: {
    value: 3,
    text: '平台'
  }
}
export const allStatus = {
  up: {
    value: 1,
    text: '上架'
  },
  down: {
    value: 2,
    text: '下架'
  }
}

export const convertFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const priceField = ['st_price', 'supply_price']
      const intField = ['stock', 'category_id', 'service_tag_group_id', 'after_service_id', 'delivery_region_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return R.assoc('tp', ResourceService.allTp.img.value)(headItem)
          })(val)
        } else if (key === 'cover') {
          if (val && val.url) {
            val.tp = ResourceService.allTp.img.value
            return val
          } else {
            return null
          }
        } else if (priceField.indexOf(key) !== -1) {
          return R_.convertYuanToFen(val)
        } else if (intField.indexOf(key) !== -1) {
          return parseInt(val)
        } else if (key === 'skus') {
          return R.map(skuItem => {
            skuItem.suggest_price = R_.convertYuanToFen(skuItem.suggest_price)
            skuItem.stock = parseInt(skuItem.stock)
            if (skuItem.image && skuItem.image.url) {
              skuItem.image.tp = ResourceService.allTp.img.value
            } else {
              skuItem.image = null
            }
            return skuItem
          })(val)
        } else if (key === 'tags') {
          return R.map(tagsItem => {
            return tagsItem.id
          })(val || [])
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        status: obj.status,
        category_id: obj.category_id,
        oversea: !!obj.oversea,
        supply_price: obj.supply_price,
        skus: obj.skus,
        tags: obj.tags,
        service_tag_group_id: obj.service_tag_group_id,
        after_service_id: obj.after_service_id,
        delivery_region_id: obj.delivery_region_id
      }
      return R.pickAll(['id', 'status', 'head', 'cover', 'name', 'sell_point', 'st_price', 'content', 'prop'])(obj)
    }
  )(form)
})

export const convertModelToForm = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const newKey = {
        category_id: ['prop', 'category', 'id'],
        oversea: ['prop', 'ext', 'oversea'],
        supply_price: ['prop', 'ext', 'supply_price'],
        skus: ['prop', 'skus'],
        tags: ['prop', 'tags'],
        service_tag_group_id: ['prop', 'ext', 'service_tag_group', 'id'],
        after_service_id: ['prop', 'ext', 'after_service', 'id'],
        delivery_region_id: ['prop', 'ext', 'delivery_region', 'id']
      }
      R.forEachObjIndexed((val, key) => {
        obj[key] = R.path(val)(obj)
      }, newKey)
      return obj
    },
    (obj) => {
      const pickContent = R.pickAll(['id', 'tp', 'text', 'url', 'width', 'height'])
      const priceField = ['st_price', 'supply_price']
      const intField = ['stock', 'category_id', 'service_tag_group_id', 'after_service_id', 'delivery_region_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return pickContent(headItem)
          })(val || [])
        } else if (key === 'cover') {
          return pickContent(val || {})
        } else if (priceField.indexOf(key) !== -1) {
          if (val === 0) {
            return ''
          }
          return `${R_.convertFenToYuan(val)}`
        } else if (intField.indexOf(key) !== -1) {
          if (!val) {
            return ''
          }
          return `${val}`
        } else if (key === 'skus') {
          return R.map(skuItem => {
            skuItem.suggest_price = `${R_.convertFenToYuan(skuItem.suggest_price)}`
            skuItem.stock = `${skuItem.stock}`
            skuItem.image = pickContent(skuItem.image || {})
            return skuItem
          })(val || [])
        } else if (key === 'content') {
          return R.map(contentItem => {
            return pickContent(contentItem)
          })(val || [])
        } else if (key === 'tags') {
          if (!val) {
            return []
          }
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        status: obj.status,
        category_id: obj.category_id,
        oversea: !!obj.oversea,
        supply_price: obj.supply_price,
        skus: obj.skus
      }
      return R.pickAll(['id', 'status', 'head', 'cover', 'name', 'sell_point', 'st_price', 'category_id', 'oversea', 'supply_price', 'skus', 'content', 'tags', 'service_tag_group_id', 'after_service_id', 'delivery_region_id'])(obj)
    }
  )(form)
})

export const showCover = (product) => {
  if (product.cover) {
    return product.cover.url
  }
  if (product.head && product.head.length > 0 && product.head[0].url) {
    return product.head[0].url
  }
  return ''
}

export const showSuggestPriceInterval = (product) => {
  if (!product) {
    return ''
  }
  if (product.prop.min_suggest_price === product.prop.max_suggest_price) {
    return `${R_.convertFenToYuan(product.prop.min_suggest_price)}`
  }
  return `${R_.convertFenToYuan(product.prop.min_suggest_price)}~${R_.convertFenToYuan(product.prop.max_suggest_price)}`
}
export const showProfit = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_profit === product.max_profit) {
    return `${R_.convertFenToYuan(product.min_profit)}`
  } else {
    return `${R_.convertFenToYuan(product.min_profit)}~${R_.convertFenToYuan(product.max_profit)}`
  }
}
export const showPriceInterval = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_price === product.max_price) {
    return `${R_.convertFenToYuan(product.min_price)}`
  }
  return `${R_.convertFenToYuan(product.min_price)}~${R_.convertFenToYuan(product.max_price)}`
}
export const copyCreate = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const pickContent = R.pickAll(['tp', 'text', 'url', 'width', 'height'])
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return pickContent(headItem)
          })(val || [])
        } else if (key === 'cover') {
          return pickContent(val || {})
        } else if (key === 'content') {
          return R.map((item) => {
            delete item.id
            return item
          })(val || [])
        } else if (key === 'skus') {
          return R.map((item) => {
            delete item.ct
            delete item.mt
            delete item.id
            if (item.image) {
              delete item.image.id
            }
            return item
          })(val || [])
        }
        return val
      })(obj)
    }, (obj) => {
      return obj
    }
  )(form)
})
