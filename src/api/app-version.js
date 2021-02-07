import Axios from 'axios'
import qs from 'qs'

export const getDraftList = () => {
  return Axios.get(`/admin/audit/draft`)
}
export const getTemplateList = () => {
  return Axios.get(`/admin/audit/template`)
}
export const AddDraftToTemplate = (id) => {
  let formData = {
    draft_id: id
  }
  return Axios.post(`/admin/audit/draft/totemplate`, qs.stringify(formData))
}
export const deleteTemplate = (id) => {
  let formData = {
    template_id: id
  }
  return Axios.post(`/admin/audit/template/del`, qs.stringify(formData))
}
export const newVersion = (id, version, desc) => {
  let formData = {
    template_id: id,
    version: version,
    desc: desc
  }
  return Axios.post(`/admin/audit/submit/`, qs.stringify(formData))
}

export const getTotalData = () => {
  return Axios.get(`/admin/audit/stat`)
}
export const getAuditList = (params) => {
  return Axios.get(`/admin/audit`, {params: params})
}
export const refreshAppStatus = (id) => {
  return Axios.post(`/admin/audit/tenant/${id}/refresh`)
}
export const retryAudit = (id) => {
  return Axios.post(`/admin/audit/tenant/${id}/resubmit`)
}
export const release = (id) => {
  return Axios.post(`/admin/audit/tenant/${id}/release`)
}
export const getOnlineList = () => {
  return Axios.get(`/admin/audit/online/templateid`)
}
