from fastapi import FastAPI

app = FastAPI(title='RAYR API')

@app.get('/')
def root():
return {'status':'running'}

@app.get('/api/ping')
def ping():
return {'status':'ok'}
