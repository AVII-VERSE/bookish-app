.PHONY: help install test run clean dev docs

help:
	@echo "Medical Document Analysis API - Available Commands:"
	@echo ""
	@echo "  make install    - Install dependencies"
	@echo "  make test       - Run tests"
	@echo "  make run        - Start the API server"
	@echo "  make dev        - Start server in development mode with reload"
	@echo "  make docs       - Open API documentation in browser"
	@echo "  make clean      - Clean up cache files"
	@echo "  make example    - Run example usage script"
	@echo ""

install:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt
	@echo ""
	@echo "✓ Dependencies installed!"
	@echo "Note: You may need to install system dependencies:"
	@echo "  Ubuntu/Debian: sudo apt-get install libmagic1"
	@echo "  macOS: brew install libmagic"

test:
	. venv/bin/activate && pytest tests/ -v

test-coverage:
	. venv/bin/activate && pytest tests/ --cov=app --cov-report=html --cov-report=term

run:
	. venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000

dev:
	. venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

docs:
	@echo "Opening API documentation..."
	@echo "API Docs: http://localhost:8000/docs"
	@echo "ReDoc: http://localhost:8000/redoc"
	@xdg-open http://localhost:8000/docs 2>/dev/null || open http://localhost:8000/docs 2>/dev/null || echo "Please open http://localhost:8000/docs in your browser"

example:
	. venv/bin/activate && python example_usage.py

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name ".coverage" -delete 2>/dev/null || true
	@echo "✓ Cleaned up cache files"

lint:
	. venv/bin/activate && python -m flake8 app/ tests/ --max-line-length=120 --exclude=venv 2>/dev/null || echo "flake8 not installed, skipping..."

format:
	. venv/bin/activate && python -m black app/ tests/ --line-length=120 2>/dev/null || echo "black not installed, skipping..."
