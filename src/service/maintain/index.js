export const getShowList = (data) => {
  let item1 = {
    name: '已上线',
    number: data.online_success ? data.online_success : 0
  }
  let item2 = {
    name: '审核成功',
    number: data.audit_ok ? data.audit_ok : 0
  }
  let item3 = {
    name: '上线失败',
    number: data.online_fail ? data.online_fail : 0
  }
  let item4 = {
    name: '审核中',
    number: data.audit_process ? data.audit_process : 0
  }
  let item5 = {
    name: '审核失败',
    number: data.audit_fail ? data.audit_fail : 0
  }
  return [item1, item2, item3, item4, item5]
}
