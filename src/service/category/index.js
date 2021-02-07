import * as R from 'ramda'

export const convertModelToForm = R.curry((model) => {
  return R.pipe(
    R.clone,
    R.pickAll(['id', 'name', 'parent_id'])
  )(model)
})

export const convertFormToParam = R.curry((formData) => {
  return R.pipe(
    R.clone,
    R.pickAll(['id', 'name', 'parent_id'])
  )(formData)
})
