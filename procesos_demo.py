import os
import time
import multiprocessing
import subprocess


def worker(number):
    """Función de trabajo que se ejecuta en un proceso hijo."""
    print(f"[Hijo] PID={os.getpid()}, PPID={os.getppid()}, número={number}")
    time.sleep(1)
    return number * number


def run_subprocess():
    """Ejecuta un comando sencillo como proceso aparte usando subprocess."""
    print("\n[Subproceso] Ejecutando comando 'python --version'...")
    try:
        result = subprocess.run(
            ["python", "--version"],
            capture_output=True,
            text=True,
            check=True,
        )
        print("Salida del subproceso:")
        print(result.stdout.strip() or result.stderr.strip())
    except subprocess.CalledProcessError as exc:
        print("Error al ejecutar el subproceso:", exc)


def main():
    print(f"[Principal] PID={os.getpid()}, proceso padre={os.getppid()}")

    run_subprocess()

    print("\n[Multiprocessing] Creando 3 procesos hijos...")
    with multiprocessing.Pool(processes=3) as pool:
        numbers = [2, 3, 4]
        results = pool.map(worker, numbers)

    print("\nResultados devueltos por los procesos hijos:")
    for n, square in zip(numbers, results):
        print(f"  {n}^2 = {square}")

    print("\nDemostración de procesos completada.")


if __name__ == "__main__":
    main()
