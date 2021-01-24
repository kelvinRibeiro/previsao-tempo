
export const setState = (state, context) => {

  state.current = context.current
  
  context.daily.splice(0, 1)
  
  state.nexts = context.daily

	state.loading = false
}